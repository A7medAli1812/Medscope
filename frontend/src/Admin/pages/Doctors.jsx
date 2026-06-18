import React, { useEffect, useState, useCallback } from "react";
import "../styles/Doctors.css";
import { getDoctors, toggleDoctorStatus } from "../services/doctors";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import Loader from "../../components/Loader";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";

const PAGE_SIZE = 7;

const Doctors = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || "Admin";
  const userRole = user.role || "Admin";

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  // Modal states
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: null, isDestructive: false });
  const [successMsg, setSuccessMsg] = useState("");

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDoctors({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        specialty,
      });

      // Handle different response shapes
      const responseData = res;
      let items = [];
      let total = 0;

      if (responseData?.data && Array.isArray(responseData.data)) {
        items = responseData.data;
        total = responseData.totalCount || responseData.total || items.length;
      } else if (Array.isArray(responseData)) {
        items = responseData;
        total = items.length;
      } else if (responseData?.items && Array.isArray(responseData.items)) {
        items = responseData.items;
        total = responseData.totalCount || items.length;
      } else {
        items = [];
        total = 0;
      }

      setDoctors(items);
      setTotalCount(total);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      if (error.response?.status !== 401) {
        toast.error("Failed to load doctors");
      }
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, specialty]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Reset page when specialty changes
  useEffect(() => {
    setPage(1);
  }, [specialty]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  // Toggle doctor Active/Inactive
  const handleToggleStatus = (doctorId) => {
    const doc = doctors.find((d) => (d.doctorId || d.id) === doctorId);
    const docName = doc ? (doc.name || doc.fullName) : "this doctor";
    const isActive = doc && (doc.status || "").toLowerCase() === "active";

    setConfirmConfig({
      isOpen: true,
      title: isActive ? "Deactivate Doctor?" : "Activate Doctor?",
      message: `Are you sure you want to ${isActive ? "deactivate" : "activate"} ${docName}?`,
      isDestructive: isActive,
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          setLoading(true);
          await toggleDoctorStatus(doctorId);
          setSuccessMsg(`Doctor status updated successfully`);
          // Update locally for instant feedback
          setDoctors((prev) =>
            prev.map((d) => {
              if ((d.doctorId || d.id) === doctorId) {
                const currentStatus = (d.status || "").toLowerCase();
                return {
                  ...d,
                  status: currentStatus === "active" ? "Inactive" : "Active",
                };
              }
              return d;
            })
          );
        } catch (err) {
          console.error("Error toggling doctor status:", err);
          if (err.response?.status !== 401) {
            toast.error("Failed to update doctor status");
          }
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Page numbers (show max 5 around current)
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);
    if (end - start < 4 && totalPages >= 5) {
      if (start === 1) end = Math.min(5, totalPages);
      else if (end === totalPages) start = Math.max(1, totalPages - 4);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="doc-page">
      {/* Top Header */}
      <div className="doc-header-block">
        <h2 className="doc-page-title">Doctors Management</h2>
        <div className="doc-profile-area">
          <div className="notification-bell-container">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            <span className="bell-badge"></span>
          </div>
          <div className="doc-profile-details">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">{userRole}</span>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="doc-card-wrapper">
        <div className="doc-card">
          {/* Sub-header: tab + button */}
          <div className="doc-card-header">
            <div className="doc-tab-active">Doctors info</div>
            <button
              className="doc-new-btn"
              onClick={() => navigate("/admin/new-doctor")}
            >
              + New Doctor
            </button>
          </div>

          {/* Filters */}
          <div className="doc-filters">
            <div className="doc-search-wrapper">
              <FontAwesomeIcon icon={faSearch} className="doc-search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="doc-search-input"
              />
            </div>

            <select
              className="doc-filter-select"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              <option value="">Filter by Specialty</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Neurology">Neurology</option>
              <option value="Dermatology">Dermatology</option>
            </select>
          </div>

          {/* Table */}
          <div className="doc-table-wrapper">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>DOCTOR ID</th>
                  <th>NAME</th>
                  <th>SPECIALTY</th>
                  <th>PHONE NUMBER</th>
                  <th>EMAIL</th>
                  <th>ACTION</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="doc-loading-cell">
                      Loading...
                    </td>
                  </tr>
                ) : doctors.length > 0 ? (
                  doctors.map((doc, index) => {
                    const did = doc.doctorId || doc.id;
                    const isActive = (doc.status || "").toLowerCase() === "active";
                    const isToggling = togglingId === did;

                    return (
                      <tr key={did}>
                        <td className="doc-id-cell">
                          DOC{String((page - 1) * PAGE_SIZE + index + 1).padStart(3, "0")}
                        </td>
                        <td className="doc-name-cell">{doc.name || doc.fullName}</td>
                        <td>{doc.specialty || "-"}</td>
                        <td>{doc.phoneNumber || doc.phone || "-"}</td>
                        <td className="doc-email-cell">{doc.email || "-"}</td>
                        <td>
                          <button
                            className={`doc-toggle-btn ${isActive ? "doc-toggle-active" : "doc-toggle-inactive"}`}
                            onClick={() => handleToggleStatus(did)}
                            disabled={isToggling}
                            title={isActive ? "Deactivate doctor" : "Activate doctor"}
                          >
                            <span className="doc-toggle-track">
                              <span className="doc-toggle-thumb"></span>
                            </span>
                          </button>
                        </td>
                        <td>
                          <span className={`doc-status-badge ${isActive ? "doc-badge-active" : "doc-badge-inactive"}`}>
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="doc-empty-cell">
                      No doctors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="doc-pagination">
            <div className="doc-pagination-info">
              {!loading && totalCount > 0 && (
                <span>
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
                </span>
              )}
            </div>
            <div className="doc-pagination-controls">
              <button
                className="doc-page-prev"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <div className="doc-page-numbers">
                {getPageNumbers().map((num) => (
                  <button
                    key={num}
                    className={`doc-page-num ${page === num ? "active" : ""}`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <button
                className="doc-page-next"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
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

export default Doctors;