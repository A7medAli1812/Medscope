import React, { useState, useEffect } from "react";
import "../styles/Adminmanagement.css";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  getAllHospitals,
} from "../services/superAdminApi";

const AdminManagement = () => {
  const [allAdmins, setAllAdmins] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterHospital, setFilterHospital] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalStep, setModalStep] = useState(null); // null | "form" | "success"
  const [editIndex, setEditIndex] = useState(null);
  const [tempPassword, setTempPassword] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    hospitalId: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  const pageSize = 7;

  // ========== Derived Data (Filtered & Paginated) ==========
  const filteredAdmins = allAdmins.filter((admin) => {
    const matchesSearch =
      !search ||
      (admin.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (admin.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (admin.employeeId || "").toLowerCase().includes(search.toLowerCase()) ||
      (admin.hospitalName || "").toLowerCase().includes(search.toLowerCase());

    const matchesHospital =
      filterHospital === "All" || admin.hospitalName === filterHospital;

    return matchesSearch && matchesHospital;
  });

  const totalPages = Math.ceil(filteredAdmins.length / pageSize) || 1;
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ========== Fetch Hospitals for dropdown ==========
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await getAllHospitals();
        setHospitals(response.data || []);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
      }
    };
    fetchHospitals();
  }, []);

  // ========== Fetch Admins ==========
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all admins (up to 1000) to support client-side filtering
      const response = await getAdmins({ Page: 1, PageSize: 1000 });
      const result = response.data;

      setAllAdmins(result.data || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ========== Hospital options for filter ==========
  const hospitalOptions = ["All", ...hospitals.map((h) => h.name)];

  // ========== Modal Handlers ==========
  const openAdd = () => {
    setEditIndex(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      hospitalId: "",
      password: "",
    });
    setModalStep("form");
  };

  const openEdit = (index) => {
    setEditIndex(index);
    const admin = paginatedAdmins[index];
    const nameParts = (admin.name || "").split(" ");
    const matchedHospital = hospitals.find((h) => h.name === admin.hospitalName);
    setFormData({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: admin.email || "",
      hospitalId: matchedHospital ? matchedHospital.id : "",
      password: "",
    });
    setModalStep("form");
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (editIndex !== null) {
        // Edit existing admin
        const admin = paginatedAdmins[editIndex];
        await updateAdmin(admin.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          hospitalId: parseInt(formData.hospitalId),
          isActive: admin.status === "Active",
          phoneNumber: "",
          department: "",
        });
        setModalStep(null);
        await fetchAdmins();
      } else {
        // Create new admin
        await createAdmin({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          hospitalId: parseInt(formData.hospitalId),
        });

        setTempPassword(formData.password);
        setModalStep("success");
        await fetchAdmins();
      }
    } catch (err) {
      console.error("Error saving admin:", err);
      const errorMsg =
        (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(", ") : null) ||
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.response?.data ||
        "Failed to save admin";
      alert(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleAdminStatus(id);
      await fetchAdmins();
    } catch (err) {
      console.error("Error toggling admin status:", err);
      const errorMsg =
        (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(", ") : null) ||
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.response?.data ||
        "Failed to toggle status";
      alert(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  if (loading && allAdmins.length === 0) {
    return (
      <div className="admin-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div className="admin-table-wrapper">
        <div className="table-card-header">
          <button className="add-btn" onClick={openAdd}>
            + Create New Admin
          </button>
          <span className="expand-icon-btn">
            <i className="fas fa-expand-arrows-alt"></i>
          </span>
        </div>

        <hr className="table-card-divider" />

        <div className="table-controls">
          <div className="search-box">
            <i className="fas fa-search"></i>
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
          <div className="filter-wrapper">
            <select
              className="filter-select"
              value={filterHospital}
              onChange={(e) => {
                setFilterHospital(e.target.value);
                setCurrentPage(1);
              }}
            >
              {hospitalOptions.map((h) => (
                <option key={h} value={h}>
                  {h === "All" ? "Filter by Hospital" : h}
                </option>
              ))}
            </select>
            <i className="fas fa-filter filter-icon"></i>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Hospital</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAdmins.map((admin, index) => (
              <tr key={admin.id || index}>
                <td className="emp-id">{admin.employeeId}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.hospitalName}</td>
                <td>
                  <span
                    className={`status-badge ${admin.status === "Active" ? "active" : "suspended"}`}
                  >
                    {admin.status}
                  </span>
                </td>
                <td>
                  {admin.lastLogin
                    ? new Date(admin.lastLogin).toLocaleString()
                    : "N/A"}
                </td>
                <td className="actions-cell">
                  <button
                    className="action-btn ban-btn"
                    onClick={() => handleToggleStatus(admin.id)}
                  >
                    <i className="fas fa-ban"></i>
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => openEdit(index)}
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            className="page-btn nav-btn"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="page-btn nav-btn"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalStep && (
        <div className="modal-overlay">
          {modalStep === "form" && (
            <div className="new-modal">
              <div className="new-modal-topbar">
                <i className="fas fa-user"></i>
                <span>
                  {editIndex !== null ? "Edit Admin" : "Create New Admin"}
                </span>
              </div>
              <div className="new-modal-body">
                <div className="new-form-field">
                  <label>
                    <i className="fas fa-user"></i> First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="new-form-field">
                  <label>
                    <i className="fas fa-user"></i> Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
                <div className="new-form-field">
                  <label>
                    <i
                      className="fas fa-envelope"
                      style={{ color: "#c0392b" }}
                    ></i>{" "}
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="new-form-field">
                  <label>
                    <i className="fas fa-home"></i> Hospital *
                  </label>
                  <select
                    value={formData.hospitalId}
                    onChange={(e) =>
                      setFormData({ ...formData, hospitalId: e.target.value })
                    }
                  >
                    <option value="">Select hospital</option>
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
                {editIndex === null && (
                  <div className="new-form-field">
                    <label>
                      <i className="fas fa-lock" style={{ color: "#c0392b" }}></i>{" "}
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="new-modal-btns">
                  <button
                    className="new-save-btn"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="new-close-btn"
                    onClick={() => setModalStep(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {modalStep === "success" && (
            <div className="new-success-modal">
              <div className="success-icon">
                <i className="fas fa-check"></i>
              </div>
              <h3>Admin created successfully</h3>
              <p>Temporary password: {tempPassword}</p>
              <div className="new-modal-btns">
                <button className="new-save-btn" onClick={openAdd}>
                  Add Another
                </button>
                <button
                  className="new-close-btn"
                  onClick={() => setModalStep(null)}
                >
                  Back to Admins
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
