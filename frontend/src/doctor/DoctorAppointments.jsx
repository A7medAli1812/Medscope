import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorAppointments.css";
import { getUpcomingAppointments } from "../api/doc/doctorAppointmentsApi";

const avatarImages = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=5",
  "https://i.pravatar.cc/100?img=8",
  "https://i.pravatar.cc/100?img=12",
  "https://i.pravatar.cc/100?img=15",
  "https://i.pravatar.cc/100?img=19",
];

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState("Day");
  const [activePage, setActivePage] = useState(1);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const today = new Date()
          .toISOString()
          .split("T")[0];

     const data = await getUpcomingAppointments(
            today,
            activeTab.toLowerCase(),
            activePage
          );

        console.log("Appointments API:", data);

        // لو الباك راجع array مباشرة
        if (Array.isArray(data)) {
          setAppointments(data);
        }

        // لو راجع object فيه items
        else if (data.items) {
          setAppointments(data.items);
        }

        // fallback
        else {
          setAppointments([]);
        }
      } catch (err) {
        console.error(err);

        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [activeTab, activePage]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="da-page">
      {/* Sidebar */}
      <aside className="da-sidebar">
        <div className="da-sidebar-top">
          <div className="da-logo">
            <div className="da-logo-icon">+</div>

            <span className="da-logo-text">
              Alhaya
            </span>
          </div>

          <nav className="da-nav">
            <div
              className="da-nav-item da-nav-active"
              onClick={() =>
                navigate("/doc/appointments")
              }
            >
              <span>Appointments</span>
            </div>

            <div
              className="da-nav-item"
              onClick={() =>
                navigate("/doc/patients")
              }
            >
              <span>Patients</span>
            </div>

            <div
              className="da-nav-item"
              onClick={() =>
                navigate("/doc/patient-record")
              }
            >
              <span>Patient Record</span>
            </div>
          </nav>
        </div>

        <div
          className="da-logout"
          onClick={handleLogout}
        >
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="da-main">
        {/* Top Header */}
        <div className="da-topbar">
          <div>
            <h1 className="da-page-title">
              Appointments
            </h1>

            <p className="da-subtitle">
              Manage all upcoming patient
              appointments
            </p>
          </div>

          <div className="da-profile">
            <img
              src="https://i.pravatar.cc/100?img=47"
              alt="doctor"
              className="da-profile-img"
            />

            <div>
              <h4>Dr. Gina</h4>
              <span>Doctor</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="da-card">
          <div className="da-card-header">
            <div>
              <h2 className="da-card-title">
                Upcoming Appointments
              </h2>

              <p className="da-card-subtitle">
                Friday, December 5, 2024
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="da-tabs">
            {["Day", "Week", "Month"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`da-tab ${
                    activeTab === tab
                      ? "da-tab-active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab(tab)
                  }
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Table */}
          <div className="da-table-wrap">
            <table className="da-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Date</th>
                  <th>Patient Name</th>
                  <th>Hospital</th>
                  <th>Visit Type</th>
                  <th>User Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="da-loading"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="da-error"
                    >
                      {error}
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="da-empty"
                    >
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  appointments.map((item, i) => (
                    <tr
                      key={item.id || i}
                    >
                      {/* Time */}
                      <td>
                        {item.time ||
                          item.appointmentTime ||
                          "N/A"}
                      </td>

                      {/* Date */}
                      <td>
                        {item.date ||
                          item.appointmentDate ||
                          "N/A"}
                      </td>

                      {/* Patient */}
                      <td>
                        <div className="da-patient-cell">
                          <img
                            src={
                              avatarImages[
                                i %
                                  avatarImages.length
                              ]
                            }
                            alt={
                              item.patient ||
                              item.patientName
                            }
                            className="da-avatar"
                          />

                          <span>
                            {item.patient ||
                              item.patientName ||
                              "Unknown"}
                          </span>
                        </div>
                      </td>

                      {/* Hospital */}
                      <td>
                        {item.hospital ||
                          item.hospitalName ||
                          "N/A"}
                      </td>

                      {/* Visit */}
                      <td>
                        <span className="da-visit-badge">
                          {item.visit ||
                            item.visitType ||
                            "Consultation"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="da-actions">
                          <button
                            className="da-btn-details"
                            onClick={() =>
                              navigate(
                                "/doc/appointment-details",
                                {
                                  state: item,
                                }
                              )
                            }
                          >
                            Details
                          </button>

                          <button
                            className="da-btn-visit"
                            onClick={() =>
                              navigate("/doc/appointment-details", {
                                state: {
                                  appointmentId:
                                    item.id || item.appointmentId,
                                },
                              }
                            )
                            }
                          >
                            Start Visit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="da-pagination">
            <button
              className="da-page-nav"
              onClick={() => {
                if (activePage > 1) {
                  setActivePage(
                    activePage - 1
                  );
                }
              }}
            >
              Previous
            </button>

            <div className="da-pages">
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  className={`da-page-btn ${
                    activePage === page
                      ? "da-page-active"
                      : ""
                  }`}
                  onClick={() =>
                    setActivePage(page)
                  }
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="da-page-nav"
              onClick={() =>
                setActivePage(activePage + 1)
              }
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorAppointments;