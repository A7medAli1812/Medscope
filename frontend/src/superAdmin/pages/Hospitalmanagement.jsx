import React, { useState, useEffect } from "react";
import "../styles/Hospitalmanagement.css";
import {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
  changeHospitalStatus,
} from "../services/superAdminApi";

const HospitalManagement = () => {
  const [allHospitals, setAllHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalStep, setModalStep] = useState(null); // null | "form" | "success"
  const [editIndex, setEditIndex] = useState(null);
  const [createdId, setCreatedId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    email: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  const pageSize = 7;

  // ========== Derived Data (Filtered & Paginated) ==========
  const filteredHospitals = allHospitals.filter((hospital) => {
    const matchesSearch =
      !search ||
      (hospital.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (hospital.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (hospital.address || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || hospital.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredHospitals.length / pageSize) || 1;
  const paginatedHospitals = filteredHospitals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ========== Fetch Hospitals ==========
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all hospitals (up to 1000) to support client-side filtering
      const response = await getHospitals({ Page: 1, PageSize: 1000 });
      const result = response.data;

      setAllHospitals(result.data || []);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
      setError("Failed to load hospitals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // ========== Modal Handlers ==========
  const openAdd = () => {
    setEditIndex(null);
    setFormData({ name: "", city: "", email: "", phone: "", address: "" });
    setModalStep("form");
  };

  const openEdit = (index) => {
    setEditIndex(index);
    const h = paginatedHospitals[index];
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
        const hospital = paginatedHospitals[editIndex];
        await updateHospital(hospital.id, {
          name: formData.name,
          city: formData.city,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          type: "General",
          hospitalNumber: Math.floor(Math.random() * 900000) + 100000,
          website: "https://medscope.com",
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
          hospitalNumber: Math.floor(Math.random() * 900000) + 100000,
          website: "https://medscope.com",
        });
        setCreatedId(formData.name);
        setModalStep("success");
      }

      // Refresh data
      await fetchHospitals();
    } catch (err) {
      console.error("Error saving hospital:", err);
      const errorMsg =
        (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(", ") : null) ||
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.response?.data ||
        "Failed to save hospital";
      alert(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?"))
      return;

    try {
      await deleteHospital(id);
      await fetchHospitals();
    } catch (err) {
      console.error("Error deleting hospital:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.response?.data ||
        "Failed to delete hospital";
      alert(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const isActive = newStatus === "Active";
      await changeHospitalStatus(id, isActive);
      await fetchHospitals();
    } catch (err) {
      console.error("Error changing status:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.response?.data ||
        "Failed to change status";
      alert(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  if (loading && allHospitals.length === 0) {
    return (
      <div className="hospital-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="hospital-page">
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div className="hospital-table-wrapper">
        <div className="table-card-header">
          <button className="add-btn" onClick={openAdd}>
            + Add New Hospital
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
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">Filter by Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
            <i className="fas fa-filter filter-icon"></i>
          </div>
        </div>

        <table className="hospital-table">
          <thead>
            <tr>
              <th>Hospital ID</th>
              <th>Hospital Name</th>
              <th>City</th>
              <th>Admins Count</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHospitals.map((hospital, index) => (
              <tr key={hospital.id}>
                <td>{hospital.id}</td>
                <td>{hospital.name}</td>
                <td>{hospital.city}</td>
                <td>{hospital.adminsCount}</td>
                <td>
                  <span
                    className={`status-badge ${hospital.status === "Active" ? "active" : "suspended"}`}
                  >
                    {hospital.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <select
                    className="action-select"
                    value={hospital.status}
                    onChange={(e) =>
                      handleStatusChange(hospital.id, e.target.value)
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(hospital.id)}
                  >
                    <i className="fas fa-times"></i>
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
                <i className="fas fa-home"></i>
                <span>
                  {editIndex !== null ? "Edit Hospital" : "Create New Hospital"}
                </span>
              </div>
              <div className="new-modal-body">
                {[
                  {
                    label: "Hospital Name",
                    icon: "fas fa-home",
                    key: "name",
                    type: "text",
                  },
                  {
                    label: "City",
                    icon: "fas fa-map-marker-alt",
                    key: "city",
                    type: "text",
                  },
                  {
                    label: "Email",
                    icon: "fas fa-envelope",
                    key: "email",
                    type: "email",
                  },
                  {
                    label: "Phone",
                    icon: "fas fa-phone",
                    key: "phone",
                    type: "text",
                  },
                  {
                    label: "Address",
                    icon: "fas fa-map-marker-alt",
                    key: "address",
                    type: "text",
                  },
                ].map(({ label, icon, key, type }) => (
                  <div className="new-form-field" key={key}>
                    <label>
                      <i className={icon}></i> {label} *
                    </label>
                    <input
                      type={type}
                      value={formData[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
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
              <h3>Hospital created successfully</h3>
              <p>Hospital: {createdId}</p>
              <div className="new-modal-btns">
                <button className="new-save-btn" onClick={openAdd}>
                  Add Another
                </button>
                <button
                  className="new-close-btn"
                  onClick={() => setModalStep(null)}
                >
                  Back to hospitals
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HospitalManagement;
