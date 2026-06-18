import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Appointments.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faCalendarAlt, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import {
  getNewAppointments,
  getCompletedAppointments,
  cancelAppointment,
  completeAppointment
} from "../services/appointments";

import Loader from "../../components/Loader";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";

const PAGE_SIZE = 10;

const Appointments = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || "Admin";
  const userRole = user.role || "Admin";

  const [activeTab, setActiveTab] = useState("new");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: null, isDestructive: false });
  const [successMsg, setSuccessMsg] = useState("");

  // Debounce search: only fire API after user stops typing for 400ms
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch appointments from server with pagination params
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        date: selectedDate
      };

      let res;
      if (activeTab === "new") {
        res = await getNewAppointments(params);
      } else {
        res = await getCompletedAppointments(params);
      }

      // The API may return data in different shapes, handle them all
      const responseData = res.data;

      // Try to extract paginated data
      let items = [];
      let total = 0;
      let pages = 1;

      if (responseData?.data && Array.isArray(responseData.data)) {
        // Shape: { data: [...], totalCount, totalPages, page }
        items = responseData.data;
        total = responseData.totalCount || responseData.total || items.length;
        pages = responseData.totalPages || responseData.pageCount || Math.ceil(total / PAGE_SIZE) || 1;
      } else if (Array.isArray(responseData)) {
        // Shape: plain array (no pagination info from server)
        items = responseData;
        total = items.length;
        pages = 1;
      } else if (responseData?.items && Array.isArray(responseData.items)) {
        // Shape: { items: [...], totalCount, totalPages }
        items = responseData.items;
        total = responseData.totalCount || responseData.total || items.length;
        pages = responseData.totalPages || Math.ceil(total / PAGE_SIZE) || 1;
      } else {
        // Fallback
        items = [];
        total = 0;
        pages = 1;
      }

      setAppointments(items);
      setTotalCount(total);
      setTotalPages(pages);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      if (err.response?.status !== 401) {
        toast.error("Failed to load appointments");
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, debouncedSearch, selectedDate]);

  // Re-fetch when tab, page, search, or date changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when switching tabs or date
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedDate]);

  // Cancel Appointment handler
  const handleCancel = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Cancel Appointment?",
      message: "Are you sure you want to cancel this appointment?",
      isDestructive: true,
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          setLoading(true);
          await cancelAppointment(id);
          setSuccessMsg("Appointment cancelled successfully");
          fetchData();
        } catch (err) {
          console.error("Error cancelling appointment:", err);
          toast.error("Failed to cancel appointment");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Complete Appointment handler
  const handleComplete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Mark Completed?",
      message: "Are you sure you want to mark this appointment as completed?",
      isDestructive: false,
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          setLoading(true);
          await completeAppointment(id);
          setSuccessMsg("Appointment completed successfully");
          fetchData();
        } catch (err) {
          console.error("Error completing appointment:", err);
          toast.error("Failed to mark appointment completed");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Generate visible page numbers (show max 5 around current)
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    // Adjust to always show 5 if possible
    if (end - start < 4 && totalPages >= 5) {
      if (start === 1) {
        end = Math.min(5, totalPages);
      } else if (end === totalPages) {
        start = Math.max(1, totalPages - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="admin-appt-container">
      {/* Top Header Section */}
      <div className="admin-appt-header-block">
        <h2 className="admin-appt-title">Appointments</h2>
        <div className="admin-appt-profile-area">
          <div className="notification-bell-container">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            <span className="bell-badge"></span>
          </div>
          <div className="profile-details">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">{userRole}</span>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="admin-appt-card-wrapper">
        <div className="admin-appt-card">
          {/* Tabs & Add Button */}
          <div className="admin-appt-header">
            <div className="tabs">
              <button
                className={activeTab === "new" ? "tab active" : "tab"}
                onClick={() => setActiveTab("new")}
              >
                NEW APPOINTMENTS
              </button>
              <button
                className={activeTab === "completed" ? "tab active" : "tab"}
                onClick={() => setActiveTab("completed")}
              >
                COMPLETED APPOINTMENTS
              </button>
            </div>
            <button className="new-appointment-btn" onClick={() => navigate("/admin/new-appointment")}>
              + New Appointment
            </button>
          </div>

          {/* Search & Date Filter */}
          <div className="admin-appt-filters">
            <div className="search-box-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="date-filter-wrapper">
              <FontAwesomeIcon icon={faCalendarAlt} className="date-filter-icon" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Appointments Table */}
          <div className="table-responsive-wrapper">
            <table className="admin-appt-table">
              <thead>
                {activeTab === "new" ? (
                  <tr>
                    <th>Time</th>
                    <th>Date</th>
                    <th>Patient Name</th>
                    <th>Patient Age</th>
                    <th>Doctor</th>
                    <th>Visit Type</th>
                    <th style={{ textAlign: "center" }}>User Action</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Time</th>
                    <th>Date</th>
                    <th>Patient Name</th>
                    <th>Patient Age</th>
                    <th>Doctor</th>
                    <th>Specialty</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={activeTab === "new" ? 7 : 6} className="table-loading-row">
                      Loading appointments...
                    </td>
                  </tr>
                ) : appointments.length > 0 ? (
                  appointments.map((a) => (
                    <tr key={a.appointmentId}>
                      <td>{a.time}</td>
                      <td>{a.date}</td>
                      <td className="patient-name-cell">{a.patientName}</td>
                      <td>{a.patientAge}</td>
                      <td>{a.doctorName}</td>
                      <td>{a.specialty || a.visitType || "-"}</td>

                      {activeTab === "new" && (
                        <td className="actions-cell">
                          <button
                            className="action-btn complete-btn"
                            onClick={() => handleComplete(a.appointmentId)}
                            title="Mark Completed"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleCancel(a.appointmentId)}
                            title="Cancel Appointment"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={activeTab === "new" ? 7 : 6} className="table-empty-row">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="admin-appt-pagination">
            <div className="pagination-info">
              {!loading && totalCount > 0 && (
                <span>
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount}
                </span>
              )}
            </div>
            <div className="pagination-controls-right">
              <button
                className="prev-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="page-numbers">
                {getPageNumbers().map((num) => (
                  <button
                    key={num}
                    className={`page-num-btn ${currentPage === num ? "active" : ""}`}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <button
                className="next-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isDestructive={confirmConfig.isDestructive}
      />

      <SuccessModal
        message={successMsg}
        onClose={() => setSuccessMsg("")}
      />

      {loading && <Loader message="Processing..." />}
    </div>
  );
};

export default Appointments;