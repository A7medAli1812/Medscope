import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/EditPatient.css";

const EditPatient = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const patient = location.state || {
    fullName: "Elizabeth Polson",
    age: 32,
    gender: "Female",
    phoneNumber: "+91 12345 67890",
    blood: "B+ve",
    email: "elizabethpolson@hotmail.com",
  };

  const [form, setForm] = useState({
    name: patient.fullName || patient.name || "",
    age: patient.age || "",
    gender: patient.gender || "",
    phone: patient.phoneNumber || patient.phone || "",
    blood: patient.blood || "",
    email: patient.email || "",
  });

  const handleSave = () => {
    console.log("Updated Patient:", form);

    // بعد الحفظ يرجع للمرضى
    navigate("/doctor/patients");
  };

  return (
    <div className="ep-page">
      <div className="ep-card">
        {/* Back */}
        <div
          className="ep-breadcrumb"
          onClick={() => navigate("/doctor/patients")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="13"
            height="13"
          >
            <polyline points="15,18 9,12 15,6" />
          </svg>

          Patient Details
        </div>

        <h2 className="ep-title">Edit Patient Details</h2>

        <div className="ep-form-grid">
          <div className="ep-field">
            <label className="ep-label">
              Patient Name <span className="ep-req">*</span>
            </label>

            <input
              className="ep-input"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="ep-field">
            <label className="ep-label">
              Age <span className="ep-req">*</span>
            </label>

            <input
              type="number"
              className="ep-input"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />
          </div>

          <div className="ep-field">
            <label className="ep-label">
              Gender <span className="ep-req">*</span>
            </label>

            <input
              className="ep-input"
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            />
          </div>

          <div className="ep-field">
            <label className="ep-label">
              Phone Number <span className="ep-req">*</span>
            </label>

            <input
              className="ep-input"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <div className="ep-field">
            <label className="ep-label">
              Blood Group <span className="ep-req">*</span>
            </label>

            <input
              className="ep-input"
              value={form.blood}
              onChange={(e) =>
                setForm({ ...form, blood: e.target.value })
              }
            />
          </div>

          <div className="ep-field">
            <label className="ep-label">
              Email Address <span className="ep-req">*</span>
            </label>

            <input
              type="email"
              className="ep-input"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>
        </div>

        <div className="ep-actions">
          <button
            className="ep-cancel-btn"
            onClick={() => navigate("/doctor/patients")}
          >
            Cancel
          </button>

          <button
            className="ep-save-btn"
            onClick={handleSave}
          >
            Save Patient
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPatient;