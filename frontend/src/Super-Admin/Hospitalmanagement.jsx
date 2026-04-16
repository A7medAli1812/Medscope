import React, { useState } from "react";
import "./HospitalManagement.css";

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([
    { id: "H001", name: "King Fahad Medical City", city: "Jeddah", admins: 8, status: "Active" },
    { id: "H002", name: "King Abdulaziz Medical City", city: "Riyadh", admins: 6, status: "Active" },
    { id: "H003", name: "Al Noor Specialist Hospital", city: "Riyadh", admins: 5, status: "Active" },
    { id: "H004", name: "Dallah Hospital", city: "Makkah", admins: 4, status: "Suspended" },
    { id: "H005", name: "Elhayat Hospital", city: "Jeddah", admins: 7, status: "Active" },
    { id: "H006", name: "Maka Hospital", city: "Makkah", admins: 2, status: "Active" },
    { id: "H007", name: "Dallah Hospital", city: "Makkah", admins: 3, status: "Active" },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalStep, setModalStep] = useState(null); // null | "form" | "success"
  const [editIndex, setEditIndex] = useState(null);
  const [createdId, setCreatedId] = useState("");
  const [formData, setFormData] = useState({ name: "", city: "", email: "", phone: "", address: "", admins: 0, status: "Active" });

  const itemsPerPage = 7;

  const filtered = hospitals.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase()) || h.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || h.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openAdd = () => {
    setEditIndex(null);
    setFormData({ name: "", city: "", email: "", phone: "", address: "", admins: 0, status: "Active" });
    setModalStep("form");
  };

  const openEdit = (index) => {
    setEditIndex(index);
    setFormData({ ...paginated[index], email: "", phone: "", address: "" });
    setModalStep("form");
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const globalIndex = hospitals.findIndex((h) => h.id === paginated[editIndex].id);
      const updated = [...hospitals];
      updated[globalIndex] = { ...formData };
      setHospitals(updated);
      setModalStep(null);
    } else {
      const newId = `H${String(hospitals.length + 1).padStart(3, "0")}`;
      setHospitals((prev) => [...prev, { ...formData, id: newId }]);
      setCreatedId(newId);
      setModalStep("success");
    }
  };

  const handleDelete = (id) => setHospitals((prev) => prev.filter((h) => h.id !== id));
  const handleStatusChange = (id, newStatus) => setHospitals((prev) => prev.map((h) => (h.id === id ? { ...h, status: newStatus } : h)));

  return (
    <div className="hospital-page">
      <button 
        className="add-btn" 
        onClick={openAdd}
        style={{ marginLeft: "auto", display: "block", marginBottom: "20px" }}
      >
        + Add New Hospital
      </button>

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
            {paginated.map((hospital, index) => (
              <tr key={hospital.id}>
                <td>{hospital.id}</td>
                <td>{hospital.name}</td>
                <td>{hospital.city}</td>
                <td>{hospital.admins}</td>
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
                  <button className="new-save-btn" onClick={handleSave}>Save</button>
                  <button className="new-close-btn" onClick={() => setModalStep(null)}>Close</button>
                </div>
              </div>
            </div>
          )}

          {modalStep === "success" && (
            <div className="new-success-modal">
              <div className="success-icon"><i className="fas fa-check"></i></div>
              <h3>Hospital created successfully</h3>
              <p>Hospital ID is: {createdId}</p>
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