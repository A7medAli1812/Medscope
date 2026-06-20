import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Appointments.css";

import {
  getNewAppointments,
  getCompletedAppointments,
  cancelAppointment,
  completeAppointment
} from "../api/admin/appointments";

const Appointments = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("new");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const appointmentsPerPage = 10;

  // 🔄 تحميل البيانات
  const fetchData = async () => {
    try {
      let res;

      if (activeTab === "new") {
        res = await getNewAppointments();
      } else {
        res = await getCompletedAppointments();
      }

      const data = res.data?.data || res.data || [];
      setAppointments(data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // ❌ Cancel
  const handleCancel = async (id) => {
  try {
    await cancelAppointment(id);

    setAppointments(prev =>
      prev.filter(a => a.appointmentId !== id)
    );

  } catch (err) {
    console.log(err);
  }
};

  // ✅ Complete
const handleComplete = async (id) => {
  try {
    await completeAppointment(id);

    // 🧠 نشيل العنصر من الليست مباشرة
    setAppointments(prev =>
      prev.filter(a => a.appointmentId !== id)
    );

  } catch (err) {
    console.log(err);
  }
};

  // 🔍 Search
  const searched = appointments.filter(a =>
    a?.patientName?.toLowerCase().includes(search.toLowerCase())
  );

  // 📅 Filter Date
  const filtered = selectedDate
    ? searched.filter(a => a?.date === selectedDate)
    : searched;

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / appointmentsPerPage);
  const start = (currentPage - 1) * appointmentsPerPage;

  const currentAppointments = filtered.slice(
    start,
    start + appointmentsPerPage
  );

  return (
    <div className="appointments-container">

      <h2 className="page-title">Appointments</h2>

      <div className="appointments-card">

        {/* Tabs */}
        <div className="appointments-header">

          <div className="tabs">

            <button
              className={activeTab === "new" ? "tab active" : "tab"}
              onClick={() => {
                setActiveTab("new");
                setCurrentPage(1);
              }}
            >
              NEW APPOINTMENTS
            </button>

            <button
              className={activeTab === "completed" ? "tab active" : "tab"}
              onClick={() => {
                setActiveTab("completed");
                setCurrentPage(1);
              }}
            >
              COMPLETED APPOINTMENTS
            </button>

          </div>

          <button
            className="new-appointment"
            onClick={() => navigate("/new-appointment")}
          >
            + New Appointment
          </button>

        </div>

        {/* Filters */}
        <div className="filters">

          <input
            className="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="date-filter">

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <button className="filter-btn">
              Filter by Date
            </button>

          </div>

        </div>

        {/* Table */}
        <table className="appointments-table">

          <thead>
            <tr>
              <th>Time</th>
              <th>Date</th>
              <th>Patient Name</th>
              <th>Patient Age</th>
              <th>Doctor</th>
              <th>Visit Type</th>
              {activeTab === "new" && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>

            {currentAppointments.length > 0 ? (
              currentAppointments.map((a) => (

                <tr key={a.appointmentId}>

                  <td>{a.time}</td>
                  <td>{a.date}</td>

                  <td>{a.patientName}</td>

                  <td>{a.patientAge}</td>
                  <td>{a.doctorName}</td>
                  <td>{a.visitType}</td>

                  {activeTab === "new" && (
                    <td className="actions">

                      <button
                        className="complete"
                        onClick={() => handleComplete(a.appointmentId)}
                      >
                        ✔
                      </button>

                      <button
                        className="delete"
                        onClick={() => handleCancel(a.appointmentId)}
                      >
                        ×
                      </button>

                    </td>
                  )}

                </tr>

              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Data
                </td>
              </tr>
            )}

          </tbody>

        </table>

        {/* Pagination */}
        <div className="pagination">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (

            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>

          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default Appointments;