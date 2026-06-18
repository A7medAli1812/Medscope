import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingStepper from '../../components/BookingStepper';
import { MagnifyingGlassIcon, StarIcon as StarIconSolid, XMarkIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { usePatient } from '../../context/PatientContext';
import appointmentService from '../../services/appointmentService';
import Loader from '../../../components/Loader';
import '../../styles/SelectSpecialty.css'; // Reusing layout common styles
import '../../styles/SelectDoctor.css';

const SelectDoctor = () => {
    const navigate = useNavigate();
    const { bookingData, setBookingData } = usePatient();
    
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [selectedScheduleDoctor, setSelectedScheduleDoctor] = useState(null);
    const [scheduleData, setScheduleData] = useState(null);
    const [scheduleLoading, setScheduleLoading] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                // Defensive checks: ensure hospital and specialty exist
                if (!bookingData?.hospitalId) {
                    setError("Hospital not selected. Please go back and select a hospital.");
                    setLoading(false);
                    return;
                }

                const specArg = typeof bookingData?.specialty === 'string' 
                                ? bookingData.specialty 
                                : (bookingData?.specialtyName || bookingData?.specialtyId);

                if (!specArg) {
                    setError("Specialty not selected. Please go back and select a specialty.");
                    setLoading(false);
                    return;
                }

                console.log(`[SelectDoctor] Preparing API request => hospitalId: ${bookingData.hospitalId}, specialty: ${specArg}`);

                const data = await appointmentService.getDoctors(bookingData.hospitalId, specArg);
                setDoctors(data || []);
            } catch (err) {
                console.error("Failed to fetch doctors:", err);
                // Extract detailed errors if available
                let detailedErrs = "";
                if (err.response?.data?.errors) {
                    detailedErrs = JSON.stringify(err.response.data.errors);
                } else if (err.response?.data) {
                    detailedErrs = JSON.stringify(err.response.data);
                }
                
                setError(`Could not load doctors. Status: ${err.response?.status}. Details: ${detailedErrs}`);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doc => 
        (doc.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderStars = (rating = 0) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<StarIconSolid key={i} className="star-icon" style={{width: 16, height: 16}} />);
            } else {
                stars.push(<StarIconOutline key={i} className="star-icon empty" style={{width: 16, height: 16}} />);
            }
        }
        return stars;
    };

    const handleSelectDoctor = (doc) => {
        setBookingData(prev => ({
            ...prev,
            doctorId: doc.id,
            doctorName: doc.name,
            doctorImage: doc.image
        }));
        navigate('/patient/appointments/book/datetime');
    };

    const handleViewSchedule = async (doc) => {
        setSelectedScheduleDoctor(doc);
        setScheduleModalOpen(true);
        setScheduleLoading(true);
        try {
            const data = await appointmentService.getDoctorSchedule(doc.id);
            setScheduleData(data);
        } catch (err) {
            console.error("Failed to fetch schedule", err);
            setScheduleData(null);
        } finally {
            setScheduleLoading(false);
        }
    };

    return (
        <div className="booking-layout">
            <div className="booking-header">
                <h2 className="booking-title">Book a New Appointment</h2>
                <p className="booking-subtitle">Choose specialty, doctor, and time — confirm in one step.</p>
            </div>

            <BookingStepper currentStep={2} />

            <div className="booking-wizard-wrapper">

                <div className="specialty-search-wrapper">
                    <MagnifyingGlassIcon className="specialty-search-icon" style={{ color: '#64748b', width: 24, height: 24 }} />
                    <input
                        type="text"
                        className="specialty-search-input"
                        placeholder="Search by doctor's name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading && <Loader />}
                {error && <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</div>}

                {!loading && !error && (
                    <div className="doctor-list-container">
                        {filteredDoctors.length === 0 ? (
                            <p style={{ textAlign: 'center' }}>No doctors found matching your search.</p>
                        ) : (
                            filteredDoctors.map((doc) => (
                                <div key={doc.id} className="doctor-card">
                                    <div className="doctor-info-section">
                                        <img src={doc.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200'} alt={doc.name} className="doctor-avatar" />
                                        <div className="doctor-details">
                                            <h3 className="doctor-name-title">{doc.name}</h3>
                                            <p className="doctor-card-specialty">{doc.specialty}</p>
                                            <div className="doctor-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span style={{ color: '#004a61', fontWeight: '600' }}>{doc.rating || 0}</span>
                                                <div style={{ display: 'flex' }}>{renderStars(doc.rating)}</div>
                                                <span>({doc.reviews || 0} reviews)</span>
                                            </div>
                                            <p className="doctor-bio">{doc.bio || 'No bio available for this doctor.'}</p>
                                        </div>
                                    </div>
                                    <div className="doctor-action-section">
                                        <button className="btn-view-schedule" onClick={() => handleViewSchedule(doc)}>View Schedule</button>
                                        <button className="btn-select-doctor" onClick={() => handleSelectDoctor(doc)}>Select</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* View Schedule Modal */}
            {scheduleModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', padding: '24px', borderRadius: '12px',
                        width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto',
                        position: 'relative'
                    }}>
                        <button 
                            onClick={() => setScheduleModalOpen(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <XMarkIcon style={{width: 24, height: 24, color: '#64748b'}} />
                        </button>
                        
                        <h3 style={{ marginTop: 0, marginBottom: '8px', color: '#0f172a' }}>Schedule for {selectedScheduleDoctor?.name}</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Previewing available slots</p>

                        {scheduleLoading ? (
                            <Loader />
                        ) : scheduleData && scheduleData.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {scheduleData.map((dayObj, index) => (
                                    <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: '600', color: '#334155' }}>
                                            <CalendarDaysIcon style={{width: 20, height: 20, color: '#0ea5e9'}} />
                                            {dayObj.date}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {(dayObj.slots || []).length > 0 ? (
                                                dayObj.slots.map((slot, i) => (
                                                    <span key={i} style={{ 
                                                        background: '#f1f5f9', padding: '6px 12px', borderRadius: '6px', 
                                                        fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' 
                                                    }}>
                                                        <ClockIcon style={{width: 14, height: 14}} /> {slot}
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ fontSize: '13px', color: '#94a3b8' }}>No slots available</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#64748b' }}>No schedule data available for this doctor.</p>
                        )}
                        
                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                className="btn-select-doctor"
                                onClick={() => {
                                    setScheduleModalOpen(false);
                                    handleSelectDoctor(selectedScheduleDoctor);
                                }}
                            >
                                Continue with Doctor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectDoctor;