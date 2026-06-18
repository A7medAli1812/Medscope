import React, { useEffect, useState } from "react";
import "../styles/Patients.css";
import { getPatients, deletePatient, updatePatient } from "../services/patients";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faFilter, faSearch, faPen, faTimes } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import Loader from "../../components/Loader";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";

const Patients = () => {
  // Retrieve user details from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || "Jonitha";
  const userRole = user.role || "Admin";

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: null, isDestructive: false });
  const [successMsg, setSuccessMsg] = useState("");

  // Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    bloodGroup: "",
    age: ""
  });

  const patientsPerPage = 10;

  // Fetch Patients List
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await getPatients({
        Search: search,
        Page: currentPage,
        PageSize: patientsPerPage,
        Gender: genderFilter
      });

      const data = res.data?.data || res.data || [];
      setPatients(data);
      setTotalCount(res.data?.totalCount || res.data?.total || 0);
    } catch (err) {
      console.error("Error fetching patients list:", err);
      toast.error("Failed to load patients list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, genderFilter, currentPage]);

  // Calculate pages
  const apiTotalPages = totalCount > 0 ? Math.ceil(totalCount / patientsPerPage) : 0;
  const fallbackTotalPages = currentPage + (patients.length === patientsPerPage ? 1 : 0);
  const totalPages = apiTotalPages || fallbackTotalPages || 1;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  // Delete Patient Handler
  const handleDelete = (id, name) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Patient?",
      message: `You are about to delete patient ${name}. This action cannot be undone.`,
      isDestructive: true,
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          setLoading(true);
          await deletePatient(id);
          setSuccessMsg("Patient deleted successfully");
          // Reload current page or filter list locally
          fetchPatients();
        } catch (err) {
          console.error("Error deleting patient:", err);
          toast.error("Failed to delete patient");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Edit Button Handler: Open modal and load patient info
  const handleEditClick = (p) => {
    setSelectedPatient(p);
    setEditForm({
      fullName: p.fullName || "",
      email: p.email || "",
      phoneNumber: p.phoneNumber || "",
      gender: p.gender || "",
      bloodGroup: p.bloodGroup || "",
      age: p.age || ""
    });
    setIsEditModalOpen(true);
  };

  // Save/Update Handler
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      setLoading(true);
      // Split full name into first and last name for UpdatePatientDto
      const nameParts = editForm.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Estimate date of birth based on age
      const estimatedBirthYear = new Date().getFullYear() - Number(editForm.age || 30);
      const estimatedDob = `${estimatedBirthYear}-01-01T00:00:00.000Z`;

      const updateData = {
        firstName,
        lastName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        gender: editForm.gender,
        bloodGroup: editForm.bloodGroup,
        dateOfBirth: estimatedDob
      };

      await updatePatient(selectedPatient.id || selectedPatient.patientId, updateData);
      setIsEditModalOpen(false);
      setSuccessMsg("Patient details updated successfully");
      fetchPatients();
    } catch (err) {
      console.error("Error updating patient profile:", err);
      toast.error("Failed to update patient profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-patients-container">
      {/* Top Header Block matching standard layout */}
      <div className="admin-patients-header-block">
        <h2 className="admin-patients-title">Patient Details</h2>
        
        <div className="admin-patients-profile-area">
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

      {/* Main card wrapper containing list panel */}
      <div className="admin-patients-card-wrapper">
        <div className="admin-patients-card">
          {/* Header Tab */}
          <div className="admin-patients-header">
            <div className="patients-tab active">Patient Info</div>
          </div>

          {/* Search and Filter Panel */}
          <div className="admin-patients-filters">
            <div className="search-box-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="filter-dropdown-wrapper">
              <FontAwesomeIcon icon={faFilter} className="dropdown-filter-icon" />
              <select
                className="gender-select-filter"
                value={genderFilter}
                onChange={(e) => {
                  setGenderFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Filter by Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Patients List Table */}
          <div className="table-responsive-wrapper">
            <table className="admin-patients-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Blood Group</th>
                  <th>Phone Number</th>
                  <th>Email ID</th>
                  <th style={{ textAlign: "center" }}>User Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="table-loading-row">
                      Loading patient data...
                    </td>
                  </tr>
                ) : patients.length > 0 ? (
                  patients.map((p) => {
                    const patientId = p.id || p.patientId;
                    return (
                      <tr key={patientId}>
                        <td className="patient-name-cell">{p.fullName}</td>
                        <td>{p.age || "-"}</td>
                        <td>{p.gender}</td>
                        <td>{p.bloodGroup || "-"}</td>
                        <td>{p.phoneNumber || "-"}</td>
                        <td>{p.email}</td>
                        <td className="actions-cell">
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(patientId, p.fullName)}
                            title="Delete Patient"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEditClick(p)}
                            title="Edit Patient"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="table-empty-row">
                      No patients found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination aligned to bottom-right */}
          <div className="admin-patients-pagination">
            <div></div> {/* spacer to align pagination to right */}
            <div className="pagination-controls-right">
              <button
                className="prev-btn"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`page-num-btn ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                className="next-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Patient Custom Modal Overlay */}
      {isEditModalOpen && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content">
            <div className="modal-header">
              <h3>Edit Patient Details</h3>
              <button className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Age</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  />
                </div>
                <div className="form-group half">
                  <label>Gender</label>
                  <select
                    required
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Blood Group</label>
                  <input
                    type="text"
                    placeholder="e.g. A+ve"
                    value={editForm.bloodGroup}
                    onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                  />
                </div>
                <div className="form-group half">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default Patients;