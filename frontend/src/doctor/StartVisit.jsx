import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./StartVisit.css";

import {
  addChronicDisease,
  addSurgery,
  addMedication,
  addAllergy,
} from "../api/doc/startVisitApi";

const StartVisit = ({
  appointment,
  onNavigate,
}) => {
  const navigate = useNavigate();

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const appointmentId =
    appointment?.appointmentId;

  const [chronic, setChronic] =
    useState({
      date: today,
      disease: "",
    });

  const [surgical, setSurgical] =
    useState({
      date: today,
      surgery: "",
      notes: "",
    });

  const [medications, setMedications] =
    useState({
      date: today,
      medication: "",
      frequency: "",
    });

  const [allergies, setAllergies] =
    useState({
      date: today,
      allergy: "",
      reaction: "",
    });

  const [submitted, setSubmitted] =
    useState(false);

  const handleSubmit = () => {
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);

      if (onNavigate) {
        onNavigate("appointments");
      } else {
        navigate(-1);
      }
    }, 1500);
  };

  const patient = appointment || {
    patient: "John Smith",
    id: "PT001",
  };

  return (
    <div className="sv-page">
      {/* Header */}
      <div className="sv-header">
        <div className="sv-header-logo">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            width="16"
            height="16"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        <div className="sv-header-info">
          <div className="sv-header-title">
            Patient Record
          </div>

          <div className="sv-header-sub">
            Patient:{" "}
            {patient.patient ||
              patient.name}{" "}
            (ID:{" "}
            {patient.id || "PT001"})
          </div>
        </div>
      </div>

      <div className="sv-body">
        {/* Back Button */}
        <div className="sv-back-wrapper">
          <button
            className="sv-back-btn"
            onClick={() => navigate(-1)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              width="18"
              height="18"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>

            <span>Back</span>
          </button>
        </div>

        {/* Chronic Diseases */}
        <div className="sv-card">
          <div className="sv-card-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e05252"
              strokeWidth="2"
              width="16"
              height="16"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>

            Chronic Diseases
          </div>

          <label className="sv-label">
            Date{" "}
            <span className="sv-req">
              *
            </span>
          </label>

          <input
            type="date"
            className="sv-input"
            value={chronic.date}
            onChange={(e) =>
              setChronic((f) => ({
                ...f,
                date: e.target.value,
              }))
            }
          />

          <label className="sv-label">
            Chronic Diseases{" "}
            <span className="sv-req">
              *
            </span>
          </label>

          <textarea
            className="sv-textarea"
            placeholder="Enter diagnosis..."
            value={chronic.disease}
            onChange={(e) =>
              setChronic((f) => ({
                ...f,
                disease: e.target.value,
              }))
            }
          />

          <div className="sv-add-row">
            <button
              className="sv-add-btn"
              onClick={async () => {
                try {
                  await addChronicDisease(
                    appointmentId,
                    {
                      date: chronic.date,
                      disease:
                        chronic.disease,
                    }
                  );

                  alert(
                    "Chronic disease added successfully"
                  );

                  setChronic({
                    date: today,
                    disease: "",
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Surgical History */}
        <div className="sv-card">
          <div className="sv-card-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b7ea2"
              strokeWidth="2"
              width="16"
              height="16"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>

            Surgical History
          </div>

          <label className="sv-label">
            Date{" "}
            <span className="sv-req">
              *
            </span>
          </label>

          <input
            type="date"
            className="sv-input"
            value={surgical.date}
            onChange={(e) =>
              setSurgical((f) => ({
                ...f,
                date: e.target.value,
              }))
            }
          />

          <label className="sv-label">
            Surgery{" "}
            <span className="sv-req">
              *
            </span>
          </label>

          <textarea
            className="sv-textarea"
            placeholder="Enter surgery..."
            value={surgical.surgery}
            onChange={(e) =>
              setSurgical((f) => ({
                ...f,
                surgery:
                  e.target.value,
              }))
            }
          />

          <label className="sv-label">
            Notes
          </label>

          <input
            type="text"
            className="sv-input"
            value={surgical.notes}
            onChange={(e) =>
              setSurgical((f) => ({
                ...f,
                notes: e.target.value,
              }))
            }
          />

          <div className="sv-add-row">
            <button
              className="sv-add-btn"
              onClick={async () => {
                try {
                  await addSurgery(
                    appointmentId,
                    {
                      date: surgical.date,
                      surgery:
                        surgical.surgery,
                      notes:
                        surgical.notes,
                    }
                  );

                  alert(
                    "Surgery added successfully"
                  );

                  setSurgical({
                    date: today,
                    surgery: "",
                    notes: "",
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Current Medications */}
        <div className="sv-card">
          <div className="sv-card-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3aaa72"
              strokeWidth="2"
              width="16"
              height="16"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>

            Current Medications
          </div>

          <label className="sv-label">
            Date{" "}
            <span className="sv-req">
              *
            </span>
          </label>

          <input
            type="date"
            className="sv-input"
            value={medications.date}
            onChange={(e) =>
              setMedications((f) => ({
                ...f,
                date: e.target.value,
              }))
            }
          />

          <label className="sv-label">
            Medication{" "}
            <span className="sv-req">
              *
            </span>
          </label>

          <textarea
            className="sv-textarea"
            placeholder="Enter medication..."
            value={
              medications.medication
            }
            onChange={(e) =>
              setMedications((f) => ({
                ...f,
                medication:
                  e.target.value,
              }))
            }
          />

          <label className="sv-label">
            Frequency{" "}
            <span className="sv-req">
              *
            </span>
          </label>

          <input
            type="text"
            className="sv-input"
            placeholder="e.g. 2 weeks"
            value={
              medications.frequency
            }
            onChange={(e) =>
              setMedications((f) => ({
                ...f,
                frequency:
                  e.target.value,
              }))
            }
          />

          <div className="sv-add-row">
            <button
              className="sv-add-btn"
              onClick={async () => {
                try {
                  await addMedication(
                    appointmentId,
                    {
                      date:
                        medications.date,
                      medication:
                        medications.medication,
                      frequency:
                        medications.frequency,
                    }
                  );

                  alert(
                    "Medication added successfully"
                  );

                  setMedications({
                    date: today,
                    medication: "",
                    frequency: "",
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Allergies */}
        <div className="sv-card">
          <div className="sv-card-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e07a30"
              strokeWidth="2"
              width="16"
              height="16"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />

              <line
                x1="12"
                y1="8"
                x2="12"
                y2="12"
              />

              <line
                x1="12"
                y1="16"
                x2="12.01"
                y2="16"
              />
            </svg>

            Allergies
          </div>

          <label className="sv-label">
            Date
          </label>

          <input
            type="date"
            className="sv-input"
            value={allergies.date}
            onChange={(e) =>
              setAllergies((f) => ({
                ...f,
                date: e.target.value,
              }))
            }
          />

          <label className="sv-label">
            Allergies{" "}
            <span className="sv-req">
              *
            </span>
          </label>

          <textarea
            className="sv-textarea"
            placeholder="Enter allergy..."
            value={allergies.allergy}
            onChange={(e) =>
              setAllergies((f) => ({
                ...f,
                allergy:
                  e.target.value,
              }))
            }
          />

          <label className="sv-label">
            Reaction{" "}
            <span className="sv-req">
              *
            </span>
          </label>

          <input
            type="text"
            className="sv-input"
            placeholder="e.g. rash"
            value={allergies.reaction}
            onChange={(e) =>
              setAllergies((f) => ({
                ...f,
                reaction:
                  e.target.value,
              }))
            }
          />

          <div className="sv-add-row">
            <button
              className="sv-add-btn"
              onClick={async () => {
                try {
                  await addAllergy(
                    appointmentId,
                    {
                      date:
                        allergies.date,
                      allergy:
                        allergies.allergy,
                      reaction:
                        allergies.reaction,
                    }
                  );

                  alert(
                    "Allergy added successfully"
                  );

                  setAllergies({
                    date: today,
                    allergy: "",
                    reaction: "",
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Add
            </button>
          </div>
        </div>

        <div className="sv-submit-row">
          <button
            className="sv-submit-btn"
            onClick={handleSubmit}
          >
            {submitted
              ? "Submitted ✓"
              : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartVisit;