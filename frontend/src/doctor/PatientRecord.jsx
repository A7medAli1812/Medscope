import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import "./PatientRecord.css";

import { getPatientRecord } from "../api/doc/patientRecordApi";

import {
  getPatientNotes,
  addPatientNote,
  updatePatientNote,
} from "../api/doc/patientNotesApi";

const initialRecord = {
  name: "",
  id: "",
  age: "",
  gender: "",
  phone: "",
  email: "",

  chronicDiseases: [],
  surgeries: [],
  medications: [],
  allergies: [],
};

const PatientRecord = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const patientId =
    location.state?.patientId ||
    location.state?.patient?.patientId;

  console.log("PATIENT ID:", patientId);

  const [activeTab, setActiveTab] =
    useState("medical");

  const [record, setRecord] =
    useState(initialRecord);

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showAddNote, setShowAddNote] =
    useState(false);

  const [editingNote, setEditingNote] =
    useState(null);

  const [noteForm, setNoteForm] = useState({
    date: "",
    diagnosis: "",
    treatmentPlan: "",
    followUp: "",
  });

  // ================= GET RECORD =================
  useEffect(() => {
    if (!patientId) {
      navigate("/doc/patients");
      return;
    }

    const fetchPatientRecord = async () => {
      try {
        setLoading(true);

        const data =
          await getPatientRecord(patientId);

        console.log(
          "Patient Record:",
          data
        );

        setRecord({
          name: data.fullName || "",
          id: data.patientId || "",
          age: data.age || "",
          gender: data.gender || "",
          phone: data.phoneNumber || "",
          email: data.email || "",

          chronicDiseases:
            data.chronicDiseases || [],

          surgeries:
            data.surgeries || [],

          medications:
            data.medications || [],

          allergies:
            data.allergies || [],
        });
      } catch (error) {
        console.error(
          "Error fetching patient record:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatientRecord();
  }, [patientId, navigate]);

  // ================= GET NOTES =================
  useEffect(() => {
    if (!patientId) return;

    const fetchNotes = async () => {
      try {
        const data =
          await getPatientNotes(patientId);

        console.log(
          "PATIENT NOTES:",
          data
        );

        setNotes(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotes();
  }, [patientId]);

  // ================= RESET FORM =================
  const resetForm = () => {
    setNoteForm({
      date: "",
      diagnosis: "",
      treatmentPlan: "",
      followUp: "",
    });

    setEditingNote(null);

    setShowAddNote(false);
  };

  // ================= SAVE NOTE =================
  const handleSaveNote = async () => {
    if (
      !noteForm.diagnosis ||
      !noteForm.treatmentPlan
    )
      return;

    try {
      const payload = {
        date:
          noteForm.date ||
          new Date()
            .toISOString()
            .split("T")[0],

        diagnosis: noteForm.diagnosis,

        treatmentPlan:
          noteForm.treatmentPlan,

        followUp: noteForm.followUp,
      };

      if (editingNote) {
        await updatePatientNote(
          editingNote,
          payload
        );
      } else {
        await addPatientNote(
          patientId,
          payload
        );
      }

      const updatedNotes =
        await getPatientNotes(patientId);

      setNotes(updatedNotes);

      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= EDIT NOTE =================
  const handleEditNote = (note) => {
    setEditingNote(note.id);

    setShowAddNote(true);

    setNoteForm({
      date: note.date || "",

      diagnosis: note.diagnosis || "",

      treatmentPlan:
        note.treatmentPlan || "",

      followUp: note.followUp || "",
    });
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="pt-page">
      {/* Sidebar */}
      <aside className="pt-sidebar">
        <div className="pt-sidebar-top">
          <div className="pt-logo">
            <div className="pt-logo-icon">
              +
            </div>

            <span className="pt-logo-text">
              Alhaya
            </span>
          </div>

          <nav className="pt-nav">
            <div
              className="pt-nav-item"
              onClick={() =>
                navigate(
                  "/doc/appointments"
                )
              }
            >
              <span>Appointments</span>
            </div>

            <div
              className="pt-nav-item"
              onClick={() =>
                navigate("/doc/patients")
              }
            >
              <span>Patients</span>
            </div>

            <div className="pt-nav-item pt-nav-active">
              <span>Patient Record</span>
            </div>
          </nav>
        </div>

        <div
          className="pt-logout"
          onClick={() =>
            navigate("/login")
          }
        >
          <span>Logout</span>
        </div>
      </aside>

      {/* Main */}
      <div className="pt-main">
        <div className="pr-page">
          {/* Header */}
          <div className="pr-topbar">
            <div className="pr-topbar-left">
              <div>
                <div className="pr-topbar-title">
                  Patient Record
                </div>

                <div className="pr-topbar-sub">
                  Dr. Sarah Mitchell
                </div>
              </div>
            </div>

            <div className="pr-topbar-right">
              <button
                className="pr-print-btn"
                onClick={() =>
                  window.print()
                }
              >
                Print Patient Record
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div
            className="pr-breadcrumb"
            onClick={() =>
              navigate("/doc/patients")
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="14"
              height="14"
            >
              <polyline points="15,18 9,12 15,6" />
            </svg>

            Patient Details
          </div>

          <div className="pr-body">
            {/* Patient Info */}
            <div className="pr-info-card">
              <div className="pr-info-top">
                <div>
                  <h2 className="pr-patient-name">
                    {record.name}
                  </h2>

                  <div className="pr-patient-id">
                    Patient ID: {record.id}
                  </div>
                </div>

                <button className="pr-edit-avatar">
                  D+
                </button>
              </div>

              <div className="pr-info-row">
                <div className="pr-info-field">
                  <div className="pr-field-label">
                    Age
                  </div>

                  <div className="pr-field-value">
                    {record.age}
                  </div>
                </div>

                <div className="pr-info-field">
                  <div className="pr-field-label">
                    Gender
                  </div>

                  <div className="pr-field-value">
                    {record.gender}
                  </div>
                </div>

                <div className="pr-info-field">
                  <div className="pr-field-label">
                    Phone
                  </div>

                  <div className="pr-field-value">
                    {record.phone}
                  </div>
                </div>

                <div className="pr-info-field">
                  <div className="pr-field-label">
                    Email
                  </div>

                  <div className="pr-field-value">
                    {record.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="pr-stats-row">
              <div className="pr-stat-card pr-stat-red">
                <div className="pr-stat-icon">
                  Chronic Diseases
                </div>

                <div className="pr-stat-num">
                  {
                    record
                      .chronicDiseases
                      .length
                  }
                </div>
              </div>

              <div className="pr-stat-card pr-stat-blue">
                <div className="pr-stat-icon">
                  Surgeries
                </div>

                <div className="pr-stat-num">
                  {
                    record.surgeries
                      .length
                  }
                </div>
              </div>

              <div className="pr-stat-card pr-stat-green">
                <div className="pr-stat-icon">
                  Medications
                </div>

                <div className="pr-stat-num">
                  {
                    record
                      .medications
                      .length
                  }
                </div>
              </div>

              <div className="pr-stat-card pr-stat-orange">
                <div className="pr-stat-icon">
                  Allergies
                </div>

                <div className="pr-stat-num">
                  {
                    record.allergies
                      .length
                  }
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="pr-tabs-row">
              <button
                className={`pr-tab-btn ${
                  activeTab === "medical"
                    ? "pr-tab-active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("medical")
                }
              >
                Medical History
              </button>

              <button
                className={`pr-tab-btn ${
                  activeTab === "notes"
                    ? "pr-tab-active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("notes")
                }
              >
                Notes ({notes.length})
              </button>
            </div>

            {/* Medical */}
            {activeTab === "medical" && (
              <div className="pr-section-list">
                {/* Diseases */}
                <div className="pr-section-card">
                  <div className="pr-section-title pr-title-red">
                    Chronic Diseases
                  </div>

                  {record.chronicDiseases.map(
                    (d, i) => (
                      <div
                        key={i}
                        className="pr-entry"
                      >
                        <div className="pr-entry-name">
                          {d.name}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Surgeries */}
                <div className="pr-section-card">
                  <div className="pr-section-title pr-title-blue">
                    Surgical History
                  </div>

                  {record.surgeries.map(
                    (s, i) => (
                      <div
                        key={i}
                        className="pr-entry"
                      >
                        <div className="pr-entry-name">
                          {s.name}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Medications */}
                <div className="pr-section-card">
                  <div className="pr-section-title pr-title-green">
                    Current Medications
                  </div>

                  {record.medications.map(
                    (m, i) => (
                      <div
                        key={i}
                        className="pr-entry"
                      >
                        <div className="pr-entry-name">
                          {m.name}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Allergies */}
                <div className="pr-section-card">
                  <div className="pr-section-title pr-title-orange">
                    Allergies
                  </div>

                  {record.allergies.map(
                    (a, i) => (
                      <div
                        key={i}
                        className="pr-entry"
                      >
                        <div className="pr-entry-name">
                          {a.name}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {activeTab === "notes" && (
              <div className="pr-notes-section">
                {!showAddNote && (
                  <button
                    className="pr-add-note-btn"
                    onClick={() =>
                      setShowAddNote(true)
                    }
                  >
                    Add New Note
                  </button>
                )}

                {showAddNote && (
                  <div className="pr-add-note-form">
                    <input
                      type="date"
                      className="pr-form-input"
                      value={noteForm.date}
                      onChange={(e) =>
                        setNoteForm(
                          (prev) => ({
                            ...prev,
                            date:
                              e.target
                                .value,
                          })
                        )
                      }
                    />

                    <textarea
                      className="pr-form-textarea"
                      placeholder="Diagnosis"
                      value={
                        noteForm.diagnosis
                      }
                      onChange={(e) =>
                        setNoteForm(
                          (prev) => ({
                            ...prev,
                            diagnosis:
                              e.target
                                .value,
                          })
                        )
                      }
                    />

                    <textarea
                      className="pr-form-textarea"
                      placeholder="Treatment Plan"
                      value={
                        noteForm.treatmentPlan
                      }
                      onChange={(e) =>
                        setNoteForm(
                          (prev) => ({
                            ...prev,
                            treatmentPlan:
                              e.target
                                .value,
                          })
                        )
                      }
                    />

                    <input
                      type="text"
                      className="pr-form-input"
                      placeholder="Follow-up"
                      value={
                        noteForm.followUp
                      }
                      onChange={(e) =>
                        setNoteForm(
                          (prev) => ({
                            ...prev,
                            followUp:
                              e.target
                                .value,
                          })
                        )
                      }
                    />

                    <div className="pr-note-form-actions">
                      <button
                        className="pr-save-note-btn"
                        onClick={
                          handleSaveNote
                        }
                      >
                        Save Note
                      </button>

                      <button
                        className="pr-clear-btn"
                        onClick={resetForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="pr-note-card"
                  >
                    <div className="pr-note-card-header">
                      <div>
                        <div className="pr-note-date">
                          {note.date}
                        </div>
                      </div>

                      <button
                        className="pr-note-edit-btn"
                        onClick={() =>
                          handleEditNote(
                            note
                          )
                        }
                      >
                        Edit
                      </button>
                    </div>

                    <div className="pr-note-field-label">
                      Diagnosis
                    </div>

                    <div className="pr-note-field-value">
                      {note.diagnosis}
                    </div>

                    <div className="pr-note-field-label">
                      Treatment Plan
                    </div>

                    <div className="pr-note-field-value">
                      {
                        note.treatmentPlan
                      }
                    </div>

                    <div className="pr-note-field-label">
                      Follow-up
                    </div>

                    <div className="pr-note-field-value">
                      {note.followUp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecord;