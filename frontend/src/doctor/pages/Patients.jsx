import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Patients.css";
import { getPatients } from "../services/patientsApi";
import { deletePatient } from "../services/deletePatientApi";
import Loader from "../../components/Loader";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";

const Patients = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("All");
  const [activePage, setActivePage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  // ConfirmModal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  // SuccessModal state
  const [successMessage, setSuccessMessage] = useState("");

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        setPatients(response.data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter((p) => {
    const matchSearch = (p.fullName || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchGender =
      filterGender === "All" || p.gender === filterGender;
    return matchSearch && matchGender;
  });

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setActivePage(1);
  }, [search, filterGender]);

  const displayedPatients = React.useMemo(() => {
    return filtered.slice(
      (activePage - 1) * ITEMS_PER_PAGE,
      activePage * ITEMS_PER_PAGE
    );
  }, [filtered, activePage]);

  // Step 1: click Delete → store patient + open ConfirmModal
  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowConfirm(true);
  };

  // Step 2: user confirms → close modal, show Loader, call API
  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    try {
      setDeleting(true);
      await deletePatient(patientToDelete.patientId);
      setPatients((prev) =>
        prev.filter((p) => p.patientId !== patientToDelete.patientId)
      );
      // Step 3: success → show SuccessModal
      setSuccessMessage(`${patientToDelete.fullName} has been deleted successfully.`);
    } catch (error) {
      console.error(error);
      setSuccessMessage(""); // don't show success on failure
      alert("Failed to delete patient. Please try again.");
    } finally {
      setDeleting(false);
      setPatientToDelete(null);
    }
  };

  if (loading) {
    return <Loader message="Loading patients..." />;
  }

  return (
    <div className="pt-page">
      {/* Loader — shown while delete API call is in progress */}
      {deleting && <Loader message="Deleting patient..." />}

      {/* ConfirmModal — shown when delete button is clicked */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => { setShowConfirm(false); setPatientToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete ${patientToDelete?.fullName}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDestructive={true}
      />

      {/* SuccessModal — shown after successful delete */}
      <SuccessModal
        message={successMessage}
        onClose={() => setSuccessMessage("")}
        autoDismiss={4000}
      />

      {/* Sidebar */}
      <aside className="pt-sidebar">
        <div className="pt-sidebar-top">
          <div className="da-logo">
            <div className="da-logo-icon">+</div>
          </div>

          <nav className="pt-nav">
            <div
              className="pt-nav-item"
              onClick={() => navigate("/doctor/appointments")}
            >
              <span>Appointments</span>
            </div>

            <div className="pt-nav-item pt-nav-active">
              <span>Patients</span>
            </div>

            <div
              className="pt-nav-item"
              onClick={() => navigate("/doctor/patient-record")}
            >
              <span>Patient Record</span>
            </div>

            <div
              className="pt-nav-item"
              onClick={() => navigate("/doctor/working-hours")}
            >
              <span>Working Hours</span>
            </div>
          </nav>
        </div>

        <div className="pt-logout" onClick={() => navigate("/login")}>
          <span>Logout</span>
        </div>
      </aside>

      {/* Main */}
      <main className="pt-main">
        <div className="pt-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="pt-page-title">Patients</h1>
          <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn" 
              aria-label="Toggle Theme" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'inherit', padding: '8px' }}
          >
              <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
          </button>
        </div>

        <div className="pt-card">
          <div className="pt-card-header">
            <h2 className="pt-card-title">Patient Details</h2>
            <div className="pt-card-title-line"></div>
          </div>

          {/* Toolbar */}
          <div className="pt-toolbar">
            <div className="pt-search-wrap">
              <input
                className="pt-search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="pt-filter-wrap">
              <button
                className="pt-filter-btn"
                onClick={() => setShowFilter(!showFilter)}
              >
                Filter by Gender
              </button>

              {showFilter && (
                <div className="pt-filter-dropdown">
                  {["All", "Male", "Female"].map((g) => (
                    <div
                      key={g}
                      className={`pt-filter-option ${filterGender === g ? "pt-filter-selected" : ""}`}
                      onClick={() => { setFilterGender(g); setShowFilter(false); }}
                    >
                      {g}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>User Action</th>
                </tr>
              </thead>

              <tbody>
                {displayedPatients.map((p, index) => (
                  <tr key={p.patientId || index}>
                    <td>
                      <div className="pt-patient-cell">
                        <img
                          src={`https://i.pravatar.cc/100?img=${index + 1}`}
                          alt={p.fullName}
                          className="pt-avatar"
                        />
                        {p.fullName}
                      </div>
                    </td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                    <td>{p.phoneNumber}</td>
                    <td>{p.email}</td>
                    <td>
                      <div className="pt-action-btns">
                        {/* View Record */}
                        <button
                          className="pt-icon-btn pt-icon-record"
                          title="View Record"
                          onClick={() =>
                            navigate("/doctor/patient-record", {
                              state: { patientId: p.patientId },
                            })
                          }
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                          </svg>
                        </button>

                        {/* Delete — now opens ConfirmModal */}
                        <button
                          className="pt-icon-btn pt-icon-delete"
                          title="Delete"
                          onClick={() => handleDeleteClick(p)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        </button>

                        {/* Edit */}
                        <button
                          className="pt-icon-btn pt-icon-edit"
                          title="Edit"
                          onClick={() =>
                            navigate("/doctor/edit-patient", { state: p })
                          }
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pt-pagination">
            <button
              className="pt-page-nav"
              onClick={() => { if (activePage > 1) setActivePage(activePage - 1); }}
            >
              Previous
            </button>
            <div className="pt-page-nums">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`pt-page-btn ${activePage === n ? "pt-page-active" : ""}`}
                  onClick={() => setActivePage(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              className="pt-page-nav"
              onClick={() => { if (activePage < totalPages) setActivePage(activePage + 1); }}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Patients;