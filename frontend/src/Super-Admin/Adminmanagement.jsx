import React, { useState } from "react";
import "./AdminManagement.css";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([
    { id: "EMP1001", name: "Ahmed Al-Zahrani", email: "ahmed.zahrani@kfmc.med.sa", hospital: "King Fahad", status: "Active", lastLogin: "1/30/2026, 8:30:00 AM" },
    { id: "EMP1002", name: "Fatima Al-Harbi", email: "ahmed.zahrani@kfmc.med.sa", hospital: "King Abdulaziz", status: "Active", lastLogin: "1/30/2026, 8:30:00 AM" },
    { id: "EMP1003", name: "Mohammed Ali", email: "ahmed.zahrani@kfmc.med.sa", hospital: "Prince Sultan", status: "Active", lastLogin: "1/30/2026, 8:30:00 AM" },
    { id: "EMP1004", name: "Sara Al-Mutairi", email: "ahmed.zahrani@kfmc.med.sa", hospital: "Al Noor", status: "Suspended", lastLogin: "1/30/2026, 8:30:00 AM" },
    { id: "EMP1005", name: "Ahmed Adel", email: "ahmed.zahrani@kfmc.med.sa", hospital: "Dallah Hospital", status: "Active", lastLogin: "1/30/2026, 8:30:00 AM" },
    { id: "EMP1006", name: "Khalid Al-Shehri", email: "ahmed.zahrani@kfmc.med.sa", hospital: "Elhayat", status: "Active", lastLogin: "1/30/2026, 8:30:00 AM" },
    { id: "EMP1007", name: "Yara Mostafa", email: "ahmed.zahrani@kfmc.med.sa", hospital: "Makkah", status: "Active", lastLogin: "1/30/2026, 8:30:00 AM" },
  ]);

  const hospitals = ["King Fahad", "King Abdulaziz", "Prince Sultan", "Al Noor", "Dallah Hospital", "Elhayat", "Makkah"];

  const [search, setSearch] = useState("");
  const [filterHospital, setFilterHospital] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalStep, setModalStep] = useState(null); // null | "form" | "success"
  const [editIndex, setEditIndex] = useState(null);
  const [tempPassword, setTempPassword] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", hospital: "", password: "", status: "Active" });

  const itemsPerPage = 7;
  const hospitalOptions = ["All", ...new Set(admins.map((a) => a.hospital))];

  const filtered = admins.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchHospital = filterHospital === "All" || a.hospital === filterHospital;
    return matchSearch && matchHospital;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openAdd = () => {
    setEditIndex(null);
    setFormData({ name: "", email: "", hospital: "", password: "", status: "Active" });
    setModalStep("form");
  };

  const openEdit = (index) => {
    setEditIndex(index);
    setFormData({ ...paginated[index], password: "" });
    setModalStep("form");
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const globalIndex = admins.findIndex((a) => a.id === paginated[editIndex].id);
      const updated = [...admins];
      updated[globalIndex] = { ...formData, lastLogin: admins[globalIndex].lastLogin };
      setAdmins(updated);
      setModalStep(null);
    } else {
      const newId = `EMP${1000 + admins.length + 1}`;
      const now = new Date().toLocaleString();
      const pass = Math.random().toString(36).slice(-8);
      setAdmins((prev) => [...prev, { ...formData, id: newId, lastLogin: now }]);
      setTempPassword(pass);
      setModalStep("success");
    }
  };

  const handleDelete = (id) => setAdmins((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Admin Management</h2>
          <p className="admin-subtitle">Manage your personal information and settings</p>
        </div>
        <button className="add-btn" onClick={openAdd}>+ Create New Admin</button>
      </div>

      <div className="admin-table-wrapper">
        <div className="table-controls">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
          </div>
          <select className="filter-select" value={filterHospital} onChange={(e) => { setFilterHospital(e.target.value); setCurrentPage(1); }}>
            {hospitalOptions.map((h) => <option key={h} value={h}>{h === "All" ? "Filter by Hospital" : h}</option>)}
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Employee ID</th><th>Name</th><th>Email</th><th>Hospital</th><th>Status</th><th>Last Login</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((admin, index) => (
              <tr key={admin.id}>
                <td className="emp-id">{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.hospital}</td>
                <td><span className={`status-badge ${admin.status === "Active" ? "active" : "suspended"}`}>{admin.status}</span></td>
                <td>{admin.lastLogin}</td>
                <td className="actions-cell">
                  <button className="action-btn ban-btn" onClick={() => setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, status: a.status === "Active" ? "Suspended" : "Active" } : a))}>
                    <i className="fas fa-ban"></i>
                  </button>
                  <button className="action-btn reset-btn" onClick={() => alert(`Password reset sent for ${admin.id}`)}>
                    <i className="fas fa-sync-alt"></i>
                  </button>
                  <button className="action-btn edit-btn" onClick={() => openEdit(index)}>
                    <i className="fas fa-pen"></i>
                  </button>
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
                <i className="fas fa-user"></i>
                <span>{editIndex !== null ? "Edit Admin" : "Create New Admin"}</span>
              </div>
              <div className="new-modal-body">
                <div className="new-form-field">
                  <label><i className="fas fa-user"></i> Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="new-form-field">
                  <label><i className="fas fa-envelope" style={{ color: "#c0392b" }}></i> Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="new-form-field">
                  <label><i className="fas fa-home"></i> Hospital *</label>
                  <select value={formData.hospital} onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}>
                    <option value="">Select hospital</option>
                    {hospitals.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="new-form-field">
                  <label><i className="fas fa-lock" style={{ color: "#c0392b" }}></i> Password *</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
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
              <h3>Admin created successfully</h3>
              <p>Temporary password: {tempPassword} (sent via email)</p>
              <div className="new-modal-btns">
                <button className="new-save-btn" onClick={openAdd}>Add Another</button>
                <button className="new-close-btn" onClick={() => setModalStep(null)}>Back to Admins</button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AdminManagement;