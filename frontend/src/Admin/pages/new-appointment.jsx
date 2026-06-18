import React, { useEffect, useState, useRef } from "react";
import "../styles/new-appointment.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsLeftRight, faSearch, faCalendar, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

import Loader from "../../components/Loader";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";

const NewAppointment = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || "Admin";
  const userRole = user.role || "Admin";

  // Data state
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);

  // Form state
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    patientAge: "",
    visitType: "Consultation",
    notes: ""
  });

  // Search & autocomplete state
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [patientTouched, setPatientTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [datesLoading, setDatesLoading] = useState(false);
  const [timesLoading, setTimesLoading] = useState(false);

  // Modal states
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: null, isDestructive: false });
  const [successMsg, setSuccessMsg] = useState("");

  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load initial patients & doctors
  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    try {
      setInitLoading(true);

      const patientsRes = await axiosInstance.get("/admin/patients");
      const patientsData =
        patientsRes.data?.data ||
        patientsRes.data?.patients ||
        patientsRes.data ||
        [];
      const pArr = Array.isArray(patientsData) ? patientsData : [];
      setPatients(pArr);
      setFilteredPatients(pArr);

      const doctorsRes = await axiosInstance.get("/Doctor");
      const doctorsData =
        doctorsRes.data?.data ||
        doctorsRes.data?.doctors ||
        doctorsRes.data ||
        [];
      const dArr = Array.isArray(doctorsData) ? doctorsData : [];
      setDoctors(dArr);
    } catch (err) {
      console.error("Error loading new appointment data:", err);
      if (err.response?.status !== 401) {
        toast.error("Failed to load patient and doctor data");
      }
    } finally {
      setInitLoading(false);
    }
  };

  // Handle patient search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(true);
    setPatientTouched(true);

    // Clear selected patient when typing again
    if (form.patientId) {
      setForm((prev) => ({ ...prev, patientId: "" }));
    }

    if (!value.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter((p) => {
      const name = (p.fullName || p.name || "").toLowerCase();
      const id = String(p.id || p.patientId || "");
      const phone = p.phoneNumber || p.phone || "";
      const v = value.toLowerCase();
      return name.includes(v) || id.includes(v) || phone.includes(v);
    });
    setFilteredPatients(filtered);
  };

  // Select patient from dropdown
  const handleSelectPatient = (p) => {
    const patientId = p.id || p.patientId;
    setForm((prev) => ({
      ...prev,
      patientId: String(patientId),
      patientAge: p.age ? String(p.age) : prev.patientAge
    }));
    setSearch(p.fullName || p.name || `Patient #${patientId}`);
    setShowDropdown(false);
  };

  // Doctor change → fetch available dates
  const handleDoctorChange = async (e) => {
    const doctorId = e.target.value;
    setForm((prev) => ({ ...prev, doctorId, date: "", time: "" }));
    setDates([]);
    setTimes([]);

    if (!doctorId) return;

    try {
      setDatesLoading(true);
      const res = await axiosInstance.get("/booking/available-dates", {
        params: { doctorId }
      });
      const datesData = res.data?.availableDates || res.data?.dates || res.data || [];
      setDates(Array.isArray(datesData) ? datesData : []);
    } catch (err) {
      console.error("Error fetching available dates:", err);
      if (err.response?.status !== 401) {
        toast.error("Failed to load doctor available dates");
      }
    } finally {
      setDatesLoading(false);
    }
  };

  // Date change → fetch available time slots
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setForm((prev) => ({ ...prev, date, time: "" }));
    setTimes([]);

    if (!date || !form.doctorId) return;

    try {
      setTimesLoading(true);
      const res = await axiosInstance.get("/booking/available-slots", {
        params: { doctorId: form.doctorId, date }
      });
      const timesData = res.data?.availableTimes || res.data?.times || res.data || [];
      setTimes(Array.isArray(timesData) ? timesData : []);
    } catch (err) {
      console.error("Error fetching available timeslots:", err);
      if (err.response?.status !== 401) {
        toast.error("Failed to load doctor available slots");
      }
    } finally {
      setTimesLoading(false);
    }
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setPatientTouched(true);

    if (!form.patientId) {
      toast.error("Please select a patient");
      return;
    }
    if (!form.doctorId) {
      toast.error("Please select a doctor");
      return;
    }
    if (!form.date) {
      toast.error("Please select an available date");
      return;
    }
    if (!form.time) {
      toast.error("Please select an available time slot");
      return;
    }

    setConfirmConfig({
      isOpen: true,
      title: "Schedule Appointment?",
      message: "Are you sure you want to book this appointment slot?",
      isDestructive: false,
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        const payload = {
          patientId: parseInt(form.patientId, 10),
          doctorId: parseInt(form.doctorId, 10),
          date: form.date,
          time: form.time,
          patientAge: parseInt(form.patientAge || "0", 10),
          visitType: form.visitType,
          notes: form.notes || ""
        };

        try {
          setLoading(true);
          const res = await axiosInstance.post("/admin/appointments", payload);

          if (res.status === 200 || res.status === 201) {
            setSuccessMsg("Appointment created successfully!");
          } else {
            toast.error("Something went wrong. Please try again.");
          }
        } catch (err) {
          console.error("Error creating appointment:", err);
          if (err.response?.status === 400) {
            const msg =
              err.response.data?.message ||
              err.response.data?.title ||
              JSON.stringify(err.response.data) ||
              "Invalid data. Please check all fields.";
            toast.error(msg);
          } else if (err.response?.status !== 401) {
            toast.error("Failed to create appointment. Please check availability.");
          }
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (initLoading) {
    return (
      <div className="na-page">
        <Loader message="Loading appointment form..." />
      </div>
    );
  }

  const showPatientError = patientTouched && !form.patientId && !search;

  return (
    <div className="na-page">
      {/* Main centered card */}
      <div className="na-modal-card">

        {/* Breadcrumb */}
        <div className="na-breadcrumb" onClick={() => navigate("/admin/appointments")}>
          <FontAwesomeIcon icon={faArrowsLeftRight} className="na-breadcrumb-icon" />
          <span>Appointment Management</span>
        </div>

        {/* Title */}
        <h2 className="na-title">New Appointment</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="na-form">

          {/* Row 1: Patient | Doctor */}
          <div className="na-row">
            {/* Patient */}
            <div className="na-field" ref={searchRef}>
              <label className="na-label">
                Patient <span className="na-required">*</span>
              </label>
              <div className={`na-search-wrap ${showPatientError ? "na-input-error" : ""} ${form.patientId ? "na-input-selected" : ""}`}>
                <FontAwesomeIcon icon={faSearch} className="na-search-icon" />
                <input
                  type="text"
                  className="na-search-input"
                  placeholder="Search by name, ID or phone..."
                  value={search}
                  onChange={handleSearch}
                  onFocus={() => {
                    setShowDropdown(true);
                    setPatientTouched(true);
                  }}
                  autoComplete="off"
                />
              </div>
              {showPatientError && (
                <span className="na-error-msg">Patient is a required field.</span>
              )}
              {patientTouched && search && !form.patientId && (
                <span className="na-error-msg">Patient is a required field.</span>
              )}

              {/* Autocomplete Dropdown */}
              {showDropdown && (
                <div className="na-patient-dropdown">
                  {filteredPatients.length > 0 ? (
                    <>
                      {filteredPatients.slice(0, 8).map((p) => {
                        const pid = p.id || p.patientId;
                        return (
                          <div
                            key={pid}
                            className="na-patient-option"
                            onMouseDown={() => handleSelectPatient(p)}
                          >
                            <span className="na-patient-name">{p.fullName || p.name}</span>
                            <div className="na-patient-sub">
                              {p.age && <span>Age {p.age}</span>}
                              {p.phoneNumber && <span>{p.phoneNumber}</span>}
                            </div>
                          </div>
                        );
                      })}
                      {filteredPatients.length > 8 && (
                        <div className="na-patient-more">
                          +{filteredPatients.length - 8} more — refine search
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="na-patient-no-results">No patients found.</div>
                  )}
                </div>
              )}
            </div>

            {/* Doctor */}
            <div className="na-field">
              <label className="na-label">
                Doctor <span className="na-required">*</span>
              </label>
              <div className="na-select-wrap">
                <select
                  className="na-select"
                  value={form.doctorId}
                  onChange={handleDoctorChange}
                  required
                >
                  <option value=""></option>
                  {doctors.map((d) => {
                    const did = d.doctorId || d.id;
                    return (
                      <option key={did} value={did}>
                        {d.name || d.fullName}
                        {d.specialty ? ` — ${d.specialty}` : ""}
                      </option>
                    );
                  })}
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="na-select-arrow" />
              </div>
            </div>
          </div>

          {/* Row 2: Date & Time | Patient Age */}
          <div className="na-row">
            {/* Date */}
            <div className="na-field">
              <label className="na-label">
                Date & Time <span className="na-required">*</span>
              </label>
              <div className="na-select-wrap">
                <FontAwesomeIcon icon={faCalendar} className="na-date-icon" />
                <select
                  className="na-select na-select-padded"
                  value={form.date}
                  onChange={handleDateChange}
                  required
                  disabled={!form.doctorId || datesLoading}
                >
                  <option value="">
                    {datesLoading
                      ? "Loading..."
                      : !form.doctorId
                      ? ""
                      : dates.length === 0
                      ? "No dates available"
                      : ""}
                  </option>
                  {dates.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="na-select-arrow" />
              </div>
              {/* Time slot selector (shown under date when date is picked) */}
              {form.date && (
                <div className="na-select-wrap" style={{ marginTop: 8 }}>
                  <select
                    className="na-select"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    required
                    disabled={timesLoading}
                  >
                    <option value="">
                      {timesLoading ? "Loading slots..." : times.length === 0 ? "No slots available" : "-- Choose Time --"}
                    </option>
                    {times.map((t, i) => (
                      <option key={i} value={t}>{t}</option>
                    ))}
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className="na-select-arrow" />
                </div>
              )}
            </div>

            {/* Patient Age */}
            <div className="na-field">
              <label className="na-label">
                Patient Age <span className="na-required">*</span>
              </label>
              <input
                type="number"
                className="na-input"
                min="1"
                max="120"
                placeholder=""
                value={form.patientAge}
                onChange={(e) => setForm({ ...form, patientAge: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Row 3: Visit Type | Notes */}
          <div className="na-row na-row-align-top">
            {/* Visit Type */}
            <div className="na-field">
              <label className="na-label">
                Visit Type <span className="na-required">*</span>
              </label>
              <div className="na-select-wrap">
                <select
                  className="na-select"
                  value={form.visitType}
                  onChange={(e) => setForm({ ...form, visitType: e.target.value })}
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Surgery">Surgery</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="na-select-arrow" />
              </div>
            </div>

            {/* Notes */}
            <div className="na-field">
              <label className="na-label na-label-optional">
                Notes <span className="na-optional-tag">(Optional)</span>
              </label>
              <textarea
                className="na-textarea"
                value={form.notes}
                placeholder="Add any relevant notes for the appointment..."
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="na-actions">
            <button
              type="button"
              className="na-btn-cancel"
              onClick={() => navigate("/admin/appointments")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="na-btn-save"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Appointment"}
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
          navigate("/admin/appointments");
        }}
      />

      {loading && <Loader message="Saving appointment..." />}
    </div>
  );
};

export default NewAppointment;