import React, { useState, useEffect } from "react";
import "./HospitalManagement.css";
import {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
  changeHospitalStatus,
} from "../api/superAdminApi";

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalStep, setModalStep] = useState(null); // null | "form" | "success"
  const [editIndex, setEditIndex] = useState(null);
  const [createdId, setCreatedId] = useState("");
  const [formData, setFormData] = useState({ name: "", city: "", email: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);

  const pageSize = 7;

  // ========== Fetch Hospitals ==========
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        Page: currentPage,
        PageSize: pageSize,
      };

      if (search) params.Search = search;
      if (filterStatus === "Active") params.IsActive = true;
      else if (filterStatus === "Suspended") params.IsActive = false;

      const response = await getHospitals(params);
      const result = response.data;

      setHospitals(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
      setError("Failed to load hospitals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [currentPage, search, filterStatus]);

  // ========== Modal Handlers ==========
  const openAdd = () => {
    setEditIndex(null);
    setFormData({ name: "", city: "", email: "", phone: "", address: "" });
    setModalStep("form");
  };

  const openEdit = (index) => {
    setEditIndex(index);
    const h = hospitals[index];
    setFormData({
      name: h.name || "",
      city: h.city || "",
      email: "",
      phone: "",
      address: "",
    });
    setModalStep("form");
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (editIndex !== null) {
        // Edit existing hospital
        const hospital = hospitals[editIndex];
        await updateHospital(hospital.id, {
          name: formData.name,
          city: formData.city,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        });
        setModalStep(null);
      } else {
        // Create new hospital
        await createHospital({
          name: formData.name,
          city: formData.city,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          type: "General",
          hospitalNumber: 0,
          website: "",
        });
        setCreatedId(formData.name);
        setModalStep("success");
      }

      // Refresh data
      await fetchHospitals();
    } catch (err) {
      console.error("Error saving hospital:", err);
      alert(err.response?.data || "Failed to save hospital");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;

    try {
      await deleteHospital(id);
      await fetchHospitals();
    } catch (err) {
      console.error("Error deleting hospital:", err);
      alert(err.response?.data || "Failed to delete hospital");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const isActive = newStatus === "Active";
      await changeHospitalStatus(id, isActive);
      await fetchHospitals();
    } catch (err) {
      console.error("Error changing status:", err);
      alert(err.response?.data || "Failed to change status");
    }
  };

  if (loading && hospitals.length === 0) {
    return <div className="hospital-page"><h2>Loading...</h2></div>;
  }

  return (
    <div className="hospital-page">
      <button 
        className="add-btn" 
        onClick={openAdd}
        style={{ marginLeft: "auto", display: "block", marginBottom: "20px" }}
      >
        + Add New Hospital
      </button>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div className="hospital-table-wrapper">
        <div className="table-controls">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
            <option value="All">Filter by Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <table className="hospital-table">
          <thead>
            <tr>
              <th>Hospital ID</th><th>Hospital Name</th><th>City</th><th>Admins Count</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital, index) => (
              <tr key={hospital.id}>
                <td>{hospital.id}</td>
                <td>{hospital.name}</td>
                <td>{hospital.city}</td>
                <td>{hospital.adminsCount}</td>
                <td><span className={`status-badge ${hospital.status === "Active" ? "active" : "suspended"}`}>{hospital.status}</span></td>
                <td className="actions-cell">
                  <select className="action-select" value={hospital.status} onChange={(e) => handleStatusChange(hospital.id, e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(hospital.id)}><i className="fas fa-times"></i></button>
                  <button className="action-btn edit-btn" onClick={() => openEdit(index)}><i className="fas fa-pen"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button className="page-btn nav-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} className={`page-btn ${currentPage === page ? "active" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>
          ))}
          <button className="page-btn nav-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>

      {/* Modal */}
      {modalStep && (
        <div className="modal-overlay">

          {modalStep === "form" && (
            <div className="new-modal">
              <div className="new-modal-topbar">
                <i className="fas fa-home"></i>
                <span>{editIndex !== null ? "Edit Hospital" : "Create New Hospital"}</span>
              </div>
              <div className="new-modal-body">
                {[
                  { label: "Hospital Name", icon: "fas fa-home", key: "name", type: "text" },
                  { label: "City", icon: "fas fa-map-marker-alt", key: "city", type: "text" },
                  { label: "Email", icon: "fas fa-envelope", key: "email", type: "email" },
                  { label: "Phone", icon: "fas fa-phone", key: "phone", type: "text" },
                  { label: "Address", icon: "fas fa-map-marker-alt", key: "address", type: "text" },
                ].map(({ label, icon, key, type }) => (
                  <div className="new-form-field" key={key}>
                    <label><i className={icon}></i> {label} *</label>
                    <input type={type} value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} />
                  </div>
                ))}
                <div className="new-modal-btns">
                  <button className="new-save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="new-close-btn" onClick={() => setModalStep(null)}>Close</button>
                </div>
              </div>
            </div>
          )}

          {modalStep === "success" && (
            <div className="new-success-modal">
              <div className="success-icon"><i className="fas fa-check"></i></div>
              <h3>Hospital created successfully</h3>
              <p>Hospital: {createdId}</p>
              <div className="new-modal-btns">
                <button className="new-save-btn" onClick={openAdd}>Add Another</button>
                <button className="new-close-btn" onClick={() => setModalStep(null)}>Back to hospitals</button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default HospitalManagement;