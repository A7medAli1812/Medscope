import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../styles/AppointmentDetails.css";

import { getAppointmentDetails } from "../services/AppointmentDetails";
import Loader from "../../components/Loader";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";

const AppointmentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { appointmentId } = location.state || {};
  console.log("Appointment ID:", appointmentId);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ConfirmModal: shown before navigating to patient record
  const [showConfirm, setShowConfirm] = useState(false);

  // SuccessModal: not used for a save action here, but available
  // for future actions (e.g. cancel appointment, etc.)
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await getAppointmentDetails(appointmentId);
        console.log("Appointment Details:", response);
        setData(response);
      } catch (err) {
        console.log(err);
        setError("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchDetails();
    }
  }, [appointmentId]);

  const handleViewRecordClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmViewRecord = () => {
    setShowConfirm(false);
    navigate("/doctor/patient-record", { state: data });
  };

  // ── Early returns (no hooks below this line) ──────────────────────────────

  if (!appointmentId) {
    return <p>No appointment selected</p>;
  }

  if (loading) {
    return <Loader message="Loading appointment details..." />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>No data found</p>;
  }

  return (
    <div className="ad-page">
      {/* ConfirmModal — confirm before opening patient record */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmViewRecord}
        title="View Patient Record"
        message="You are about to open the full patient record for this appointment. Do you want to continue?"
        confirmText="Yes, View Record"
        cancelText="Cancel"
      />

      {/* SuccessModal — ready for future use (e.g. cancel appointment) */}
      <SuccessModal
        message={successMessage}
        onClose={() => setSuccessMessage("")}
        autoDismiss={4000}
      />

      <div className="ad-card">
        {/* Header */}
        <div className="ad-header">
          <div>
            <h2>Appointment Details</h2>
            <p className="ad-subtitle">Patient appointment information</p>
          </div>
        </div>

        {/* Body */}
        <div className="ad-content">

          {/* Left Column */}
          <div className="ad-col">
            <div className="ad-item">
              <div className="ad-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Full Name</span>
              </div>
              <p>{data.patientName || data.patient || "N/A"}</p>
            </div>

            <div className="ad-item">
              <div className="ad-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.75h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.34a16 16 0 0 0 5.75 5.75l1.66-1.68a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Phone Number</span>
              </div>
              <p>{data.phoneNumber || data.phone || "N/A"}</p>
            </div>

            <div className="ad-item">
              <div className="ad-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span>Visit Type</span>
              </div>
              <p>{data.visitType || data.visit || "N/A"}</p>
            </div>

            <div className="ad-item">
              <div className="ad-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span>Age</span>
              </div>
              <p>{data.age || "N/A"}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="ad-col">
            <div className="ad-item">
              <div className="ad-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Date</span>
              </div>
              <p>{data.date || "N/A"}</p>
            </div>

            <div className="ad-item">
              <div className="ad-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span>Time</span>
              </div>
              <p>{data.time || "N/A"}</p>
            </div>

            <div className="ad-item">
              <div className="ad-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
                <span>Hospital</span>
              </div>
              <p>{data.hospitalName || data.hospital || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="ad-actions">
          <button
            className="ad-close-btn"
            onClick={() => navigate("/doctor/appointments")}
          >
            Back
          </button>

          <button
            className="ad-record-btn"
            onClick={handleViewRecordClick}
          >
            View Full Patient Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;