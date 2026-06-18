import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDoctor } from "../services/doctors";
import "../styles/new-doctor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserDoctor, faChevronDown, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

import Loader from "../../components/Loader";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";

const NewDoctor = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const [specialtiesLoading, setSpecialtiesLoading] = useState(false);

  // Modal states
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: null, isDestructive: false });
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    specialtyId: "",
    email: "",
    phone: "",
    status: "",
    password: ""
  });

  // Load Specialties from API
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        setSpecialtiesLoading(true);
        // Try admin endpoint first
        const res = await axiosInstance.get("/admin/specialties/by-hospital?hospitalId=1");
        let data = res.data?.data || res.data || [];
        
        // If empty or not an array, fallback to patient endpoint
        if (!Array.isArray(data) || data.length === 0) {
          const patientRes = await axiosInstance.get("/patient/appointments/specialties");
          data = patientRes.data?.data || patientRes.data || [];
        }

        // Map data if it is returned as string array to object array
        const mappedData = data.map((item, idx) => {
          if (typeof item === "string") {
            return { id: idx + 1, name: item };
          }
          return { id: item.id || idx + 1, name: item.name || item.specialtyName || "" };
        });

        setSpecialties(mappedData);
      } catch (err) {
        console.error("Error loading specialties:", err);
        // Dynamic fallback list if both fail
        setSpecialties([
          { id: 1, name: "Cardiology" },
          { id: 2, name: "Pediatrics" },
          { id: 3, name: "Orthopedics" },
          { id: 4, name: "Neurology" },
          { id: 5, name: "Dermatology" }
        ]);
      } finally {
        setSpecialtiesLoading(false);
      }
    };
    loadSpecialties();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      specialtyId: true,
      email: true,
      phone: true,
      status: true,
      password: true
    });

    // Validate empty fields
    if (!formData.name || !formData.specialtyId || !formData.email || !formData.phone || !formData.status || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email format validation (ensure no backslashes or spaces)
    const emailRegex = /^[^\s@\\]+@[^\s@\\]+\.[^\s@\\]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address (should not contain spaces or backslashes)");
      return;
    }

    // Confirmation dialog
    setConfirmConfig({
      isOpen: true,
      title: "Add Doctor?",
      message: `Are you sure you want to add Dr. ${formData.name}?`,
      isDestructive: false,
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          setLoading(true);

          const payload = {
            fullName: formData.name,
            email: formData.email,
            phoneNumber: formData.phone,
            password: formData.password,
            specialtyId: parseInt(formData.specialtyId, 10),
            gender: "Male",
            status: formData.status
          };

          console.log("Payload:", payload);

          await createDoctor(payload);
          setSuccessMsg("Doctor added successfully!");
        } catch (error) {
          console.error("Error creating doctor:", error);
          console.error("Response data:", error.response?.data);

          if (error.response?.status === 401) return;

          let errorMsg = "Failed to add doctor. Please check the data.";

          if (error.response?.data) {
            const data = error.response.data;

            if (typeof data === "string") {
              errorMsg = data;
            } else if (Array.isArray(data)) {
              errorMsg = data.map(item => typeof item === "string" ? item : JSON.stringify(item)).join("\n");
            } else if (typeof data === "object") {
              if (data.message) {
                errorMsg = data.message;
              } else if (data.description) {
                errorMsg = data.description;
              } else if (data.title) {
                errorMsg = data.title;
                if (data.errors) {
                  const errDetails = Object.entries(data.errors)
                    .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
                    .join("\n");
                  errorMsg += "\n" + errDetails;
                }
              } else if (data.errors) {
                const messages = Object.values(data.errors).flat();
                errorMsg = messages.map(m => typeof m === "string" ? m : JSON.stringify(m)).join(", ");
              } else {
                errorMsg = JSON.stringify(data, null, 2);
              }
            }
          } else if (!error.response) {
            errorMsg = "Server not reachable. Please check your connection.";
          }

          toast.error(errorMsg.length > 150 ? errorMsg.substring(0, 150) + "..." : errorMsg);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const showError = (field) => touched[field] && !formData[field];

  return (
    <div className="nd-page">
      <div className="nd-modal-card">
        {/* Breadcrumb */}
        <div className="nd-breadcrumb" onClick={() => navigate("/admin/doctors")}>
          <FontAwesomeIcon icon={faArrowLeft} className="nd-breadcrumb-icon" />
          <span>Doctors Management</span>
        </div>

        {/* Title */}
        <h2 className="nd-title">
          <FontAwesomeIcon icon={faUserDoctor} className="nd-title-icon" />
          Add Doctor
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="nd-form">

          {/* Row 1: Full Name | Major / Specialty */}
          <div className="nd-row">
            <div className="nd-field">
              <label className="nd-label">
                Full Name <span className="nd-req">*</span>
              </label>
              <input
                type="text"
                name="name"
                className={`nd-input ${showError("name") ? "nd-input-error" : ""}`}
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=""
              />
              {showError("name") && (
                <span className="nd-error-msg">Full Name is a required field.</span>
              )}
            </div>

            <div className="nd-field">
              <label className="nd-label">
                Major / Specialty <span className="nd-req">*</span>
              </label>
              <div className="nd-select-wrap">
                <select
                  name="specialtyId"
                  className={`nd-select ${showError("specialtyId") ? "nd-input-error" : ""}`}
                  value={formData.specialtyId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">{specialtiesLoading ? "Loading..." : ""}</option>
                  {specialties.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="nd-select-arrow" />
              </div>
              {showError("specialtyId") && (
                <span className="nd-error-msg">Specialty is a required field.</span>
              )}
            </div>
          </div>

          {/* Row 2: Email | Phone */}
          <div className="nd-row">
            <div className="nd-field">
              <label className="nd-label">
                Email Address <span className="nd-req">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`nd-input ${showError("email") ? "nd-input-error" : ""}`}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=""
              />
              {showError("email") && (
                <span className="nd-error-msg">Email Address is a required field.</span>
              )}
            </div>

            <div className="nd-field">
              <label className="nd-label">
                Phone Number <span className="nd-req">*</span>
              </label>
              <input
                type="text"
                name="phone"
                className={`nd-input ${showError("phone") ? "nd-input-error" : ""}`}
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=""
              />
              {showError("phone") && (
                <span className="nd-error-msg">Phone Number is a required field.</span>
              )}
            </div>
          </div>

          {/* Row 3: Status | Password */}
          <div className="nd-row">
            <div className="nd-field">
              <label className="nd-label">
                Status <span className="nd-req">*</span>
              </label>
              <div className="nd-select-wrap">
                <select
                  name="status"
                  className={`nd-select ${showError("status") ? "nd-input-error" : ""}`}
                  value={formData.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value=""></option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="nd-select-arrow" />
              </div>
              {showError("status") && (
                <span className="nd-error-msg">Status is a required field.</span>
              )}
            </div>

            <div className="nd-field">
              <label className="nd-label">
                Password <span className="nd-req">*</span>
              </label>
              <input
                type="password"
                name="password"
                className={`nd-input ${showError("password") ? "nd-input-error" : ""}`}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=""
              />
              {showError("password") && (
                <span className="nd-error-msg">Password is a required field.</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="nd-actions">
            <button
              type="button"
              className="nd-btn-cancel"
              onClick={() => navigate("/admin/doctors")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="nd-btn-save"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Doctor"}
            </button>
          </div>

        </form>
      </div>

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
        onClose={() => {
          setSuccessMsg("");
          navigate("/admin/doctors");
        }}
      />

      {loading && <Loader message="Saving doctor details..." />}
    </div>
  );
};

export default NewDoctor;