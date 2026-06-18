import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { getMedicalHistory } from '../services/medicalHistoryService';
import { getNotes } from '../services/notesService';
import '../styles/MedicalHistory.css';
import {
    PrinterIcon,
    ChartBarIcon,
    Bars3CenterLeftIcon,
    BeakerIcon,
    ExclamationCircleIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';


const MedicalHistory = () => {
    const [data, setData] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('history');

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const [historyResult, notesResult] = await Promise.all([
                    getMedicalHistory(),
                    getNotes()
                ]);
                setData(historyResult);
                setNotes(notesResult || []);
            } catch (err) {
                console.error("Failed to load medical history or notes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecord();
    }, []);

    if (loading || !data) {
        return (
            <div style={{ position: 'relative', width: '100%', minHeight: '50vh' }}>
                <Loader message="Loading Patient Record..." />
            </div>
        );
    }

    return (
        <>

        <div className="mh-record-container">
            {/* Patient Info Card */}
            <div className="mh-patient-card">
                <div className="mh-patient-header">
                    <div className="mh-patient-name-container">
                        <h2>{data.patient.name}</h2>
                        {data.patient.id && data.patient.id !== '-' && (
                            <p className="mh-patient-id">Patient ID: <strong>{data.patient.id}</strong></p>
                        )}
                    </div>
                    <div className="mh-blood-badge">{data.patient.bloodType}</div>
                </div>

                <div className="mh-patient-details">
                    {data.patient.age && data.patient.age !== '-' && (
                        <div className="mh-detail-item">
                            <span className="mh-detail-label">Age</span>
                            <span className="mh-detail-value">{data.patient.age}</span>
                        </div>
                    )}
                    {data.patient.gender && data.patient.gender !== '-' && (
                        <div className="mh-detail-item">
                            <span className="mh-detail-label">Gender</span>
                            <span className="mh-detail-value">{data.patient.gender}</span>
                        </div>
                    )}
                    <div className="mh-detail-item">
                        <span className="mh-detail-label">Phone</span>
                        <span className="mh-detail-value">{data.patient.phone}</span>
                    </div>
                    <div className="mh-detail-item">
                        <span className="mh-detail-label">Email</span>
                        <span className="mh-detail-value">{data.patient.email}</span>
                    </div>
                </div>
            </div>

            {/* Summaries */}
            <div className="mh-summary-grid">
                <div className="mh-summary-card">
                    <div className="mh-summary-header">
                        <ChartBarIcon /> Chronic Diseases
                    </div>
                    <h3 className="mh-summary-count">{data.summary.chronicDiseases}</h3>
                </div>
                <div className="mh-summary-card">
                    <div className="mh-summary-header">
                        <Bars3CenterLeftIcon /> Surgeries
                    </div>
                    <h3 className="mh-summary-count">{data.summary.surgeries}</h3>
                </div>
                <div className="mh-summary-card">
                    <div className="mh-summary-header">
                        <BeakerIcon /> Medications
                    </div>
                    <h3 className="mh-summary-count">{data.summary.medications}</h3>
                </div>
                <div className="mh-summary-card">
                    <div className="mh-summary-header">
                        <ExclamationCircleIcon className="mh-icon-red" /> Allergies
                    </div>
                    <h3 className="mh-summary-count">{data.summary.allergies}</h3>
                </div>
            </div>

            {/* Tabs */}
            <div className="mh-tabs-container">
                <button
                    className={`mh-tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    <ChartBarIcon /> Medical History
                </button>
                <button
                    className={`mh-tab ${activeTab === 'notes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notes')}
                >
                    <DocumentTextIcon /> Notes ({(data.visits?.length || 0) + notes.length})
                </button>
            </div>

            {/* Lists content */}
            {activeTab === 'history' && (
                <div className="mh-details-wrapper">

                    {/* Chronic Diseases */}
                    <div className="mh-section-card">
                        <h4 className="mh-section-title"><ChartBarIcon /> Chronic Diseases</h4>
                        {data.history.chronicDiseases.map((item, index) => (
                            <div className="mh-list-item" key={index}>
                                <div className="mh-item-content">
                                    <p className="mh-item-name">{item.name}</p>
                                    {item.diagnosedDate && <p className="mh-item-detail">Diagnosed: {item.diagnosedDate}</p>}
                                    {item.date && !item.diagnosedDate && <p className="mh-item-detail">Diagnosed: {item.date}</p>}
                                </div>
                            </div>
                        ))}
                        {data.history.chronicDiseases.length === 0 && (
                            <p style={{ color: '#5a7d91', margin: '10px 0' }}>No chronic diseases recorded.</p>
                        )}
                    </div>

                    {/* Surgeries */}
                    <div className="mh-section-card">
                        <h4 className="mh-section-title"><Bars3CenterLeftIcon /> Surgical History</h4>
                        {data.history.surgeries.map((item, index) => (
                            <div className="mh-list-item" key={index}>
                                <div className="mh-item-content">
                                    <p className="mh-item-name">{item.name}</p>
                                    {item.date && <p className="mh-item-detail"><strong>Date</strong>: {item.date}</p>}
                                    {item.hospital && <p className="mh-item-detail"><strong>Hospital</strong>: {item.hospital}</p>}
                                    {item.notes && <p className="mh-item-detail"><strong>Notes</strong>: {item.notes}</p>}
                                </div>
                            </div>
                        ))}
                        {data.history.surgeries.length === 0 && (
                            <p style={{ color: '#5a7d91', margin: '10px 0' }}>No surgeries recorded.</p>
                        )}
                    </div>

                    {/* Medications */}
                    <div className="mh-section-card">
                        <h4 className="mh-section-title"><BeakerIcon /> Current Medications</h4>
                        {data.history.medications.map((item, index) => (
                            <div className="mh-list-item" key={index}>
                                <div className="mh-item-content">
                                    <p className="mh-item-name">{item.name}</p>
                                    {item.frequency && <p className="mh-item-detail"><strong>Frequency</strong>: {item.frequency}</p>}
                                    {(item.started || item.startedDate) && <p className="mh-item-detail"><strong>Started</strong>: {item.startedDate || item.started}</p>}
                                </div>
                                {item.dosage && <div className="mh-med-pill">{item.dosage}</div>}
                            </div>
                        ))}
                        {data.history.medications.length === 0 && (
                            <p style={{ color: '#5a7d91', margin: '10px 0' }}>No current medications.</p>
                        )}
                    </div>

                    {/* Allergies */}
                    <div className="mh-section-card">
                        <h4 className="mh-section-title"><ExclamationCircleIcon className="mh-icon-red" /> Allergies</h4>
                        {data.history.allergies.map((item, index) => (
                            <div className="mh-list-item" key={index}>
                                <div className="mh-item-content">
                                    <p className="mh-item-name">{item.name}</p>
                                    {item.reaction && <p className="mh-item-detail"><strong>Reaction</strong>: {item.reaction}</p>}
                                </div>
                            </div>
                        ))}
                        {data.history.allergies.length === 0 && (
                            <p style={{ color: '#5a7d91', margin: '10px 0' }}>No allergies recorded.</p>
                        )}
                    </div>

                </div>
            )}

            {/* Notes / Visits content */}
            {activeTab === 'notes' && (
                <div className="mh-details-wrapper">
                    {/* Visits from medical history */}
                    {data.visits && data.visits.length > 0 && (
                        <div className="mh-section-card">
                            <h4 className="mh-section-title"><DocumentTextIcon /> Visit Records</h4>
                            {data.visits.map((visit, index) => (
                                <div className="mh-list-item" key={visit.id || index}>
                                    <div className="mh-item-content">
                                        <p className="mh-item-name">{visit.diagnosis || 'Visit'}</p>
                                        {visit.date && <p className="mh-item-detail">Date: {visit.date}</p>}
                                        {visit.treatmentPlan && <p className="mh-item-detail">Treatment: {visit.treatmentPlan}</p>}
                                        {visit.followUp && <p className="mh-item-detail">Follow-up: {visit.followUp}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Notes from /patient/notes endpoint */}
                    {notes.length > 0 && (
                        <div className="mh-section-card">
                            <h4 className="mh-section-title"><DocumentTextIcon /> Doctor Notes</h4>
                            {notes.map((note, index) => (
                                <div className="mh-list-item" key={note.id || index}>
                                    <div className="mh-item-content">
                                        <p className="mh-item-name">{note.title || 'Note'}</p>
                                        {note.date && <p className="mh-item-detail">{note.date}</p>}
                                        {note.content && (
                                            <p className="mh-item-detail" style={{ marginTop: '8px' }}>
                                                {note.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {(!data.visits || data.visits.length === 0) && notes.length === 0 && (
                        <div className="mh-section-card">
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                                <p style={{ color: '#5a7d91' }}>No notes or visit records available.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
        </>
    );
};

export default MedicalHistory;