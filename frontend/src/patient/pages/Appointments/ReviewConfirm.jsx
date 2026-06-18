import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingStepper from '../../components/BookingStepper';
import {
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    CalendarDaysIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

import { usePatient } from '../../context/PatientContext';
import appointmentService from '../../services/appointmentService';
import profileService from '../../services/profileService';
import Loader from '../../../components/Loader';

import '../../styles/SelectSpecialty.css';
import '../../styles/ReviewConfirm.css';

const ReviewConfirm = () => {
    const navigate = useNavigate();
    const { bookingData, resetBookingData } = usePatient();

    // ── Profile state ──────────────────────────────────────────────────────────
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    // ── Booking state ──────────────────────────────────────────────────────────
    const [appointmentNotes, setAppointmentNotes] = useState('');
    const [visitType, setVisitType] = useState('Clinic');
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ── Visit type options ─────────────────────────────────────────────────────
    const VISIT_TYPE_OPTIONS = [
        { label: 'Clinic Visit', value: 'Clinic' },
        { label: 'Online Consultation', value: 'Online' },
        { label: 'Home Visit', value: 'HomeVisit' }
    ];

    // ── Fetch patient profile on mount ─────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile();
                if (!cancelled) setProfile(data);
            } catch (err) {
                console.error('[ReviewConfirm] Failed to load profile:', err);
                if (!cancelled) setError('Failed to load your profile. Please try again.');
            } finally {
                if (!cancelled) setProfileLoading(false);
            }
        };

        fetchProfile();
        return () => { cancelled = true; };
    }, []);

    // ── Convert 12-hour → 24-hour ──────────────────────────────────────────────
    const convertTo24Hour = (time) => {
        if (!time) return '00:00';
        // Already in 24h format (no AM/PM)
        if (!time.includes('AM') && !time.includes('PM')) return time;

        const [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':');

        if (modifier === 'PM' && hours !== '12') {
            hours = String(+hours + 12);
        }
        if (modifier === 'AM' && hours === '12') {
            hours = '00';
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    // ── Submit booking (select → confirm) ────────────────────────────────────
    const handleConfirmBooking = async () => {
        setLoading(true);
        setError('');

        try {
            const strictIsoDate =
                bookingData.dateIso ||
                new Date(bookingData.date).toISOString().split('T')[0];

            const formattedTime = convertTo24Hour(bookingData.time);

            // Step 1: Create booking session via POST /select
            // PatientCreateAppointmentDto: { doctorId, date, time, appointmentNotes }
            const selectPayload = {
                doctorId: bookingData.doctorId,
                date: strictIsoDate,
                time: formattedTime,
                appointmentNotes: appointmentNotes.trim() || ''
            };

            await appointmentService.selectAppointment(selectPayload);

            // Step 2: Confirm via POST /confirm
            // ConfirmAppointmentDto: { appointmentNotes, visitType }
            const confirmPayload = {
                appointmentNotes: appointmentNotes.trim() || '',
                visitType
            };

            await appointmentService.confirmAppointment(confirmPayload);

            setShowSuccess(true);

            setTimeout(() => {
                resetBookingData();
                navigate('/patient/appointments/upcoming');
            }, 2500);
        } catch (err) {
            const backendMsg =
                err.response?.data?.message ||
                err.response?.data?.title ||
                (typeof err.response?.data === 'string' ? err.response.data : null);

            setError(backendMsg || 'Failed to create appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Success screen ─────────────────────────────────────────────────────────
    if (showSuccess) {
        return (
            <div className="booking-layout">
                <div className="success-overlay">
                    <div className="success-card">
                        <CheckCircleIcon className="success-icon" />
                        <h2>Appointment Booked Successfully!</h2>
                        <p>Your appointment with {bookingData?.doctorName || 'the doctor'} has been scheduled.</p>
                        <p className="redirect-text">Redirecting to your appointments...</p>
                    </div>
                </div>
            </div>
        );
    }

    // ── No booking data guard ──────────────────────────────────────────────────
    if (!bookingData?.doctorId) {
        return (
            <div className="booking-layout">
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p>No booking data found.</p>
                    <button
                        className="btn-wizard-next"
                        onClick={() => navigate('/patient/appointments/book/hospital')}
                    >
                        Start Over
                    </button>
                </div>
            </div>
        );
    }

    // ── Derived display values ─────────────────────────────────────────────────
    const fullName = profile
        ? `${profile.firstName} ${profile.lastName}`.trim()
        : '';

    const isReady = !profileLoading && profile !== null && !!visitType;

    return (
        <div className="booking-layout">

            <div className="booking-header">
                <h2 className="booking-title">Book a New Appointment</h2>
                <p className="booking-subtitle">
                    Choose specialty, doctor, and time — confirm in one step.
                </p>
            </div>

            <BookingStepper currentStep={4} />

            <div className="booking-wizard-wrapper">

                {error && (
                    <div className="review-error-banner" role="alert">
                        {error}
                    </div>
                )}

                <div className="review-container">
                    <h3 className="review-header">Review &amp; Confirm</h3>

                    {/* Loading state while fetching profile */}
                    {profileLoading && <Loader />}

                    {!profileLoading && (
                        <div className="review-content">

                            {/* LEFT FORM */}
                            <div className="review-form-section">

                                {/* Full Name (readonly) */}
                                <div className="form-group-review">
                                    <label className="review-label">
                                        <UserIcon /> Full Name
                                    </label>
                                    <input
                                        id="review-fullname"
                                        type="text"
                                        className="review-input review-input-readonly"
                                        value={fullName}
                                        readOnly
                                    />
                                </div>

                                <div className="form-row-2col">

                                    {/* Phone (readonly) */}
                                    <div className="form-group-review">
                                        <label className="review-label">
                                            <PhoneIcon /> Phone
                                        </label>
                                        <input
                                            id="review-phone"
                                            type="tel"
                                            className="review-input review-input-readonly"
                                            value={profile?.phoneNumber || ''}
                                            readOnly
                                        />
                                    </div>

                                    {/* Email (readonly) */}
                                    <div className="form-group-review">
                                        <label className="review-label">
                                            <EnvelopeIcon /> Email
                                        </label>
                                        <input
                                            id="review-email"
                                            type="email"
                                            className="review-input review-input-readonly"
                                            value={profile?.email || ''}
                                            readOnly
                                        />
                                    </div>

                                </div>

                                {/* Blood Type (readonly) */}
                                <div className="form-group-review">
                                    <label className="review-label">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="blood-icon">
                                            <path d="M12 2C12 2 5 9.5 5 14.5C5 18.64 8.13 22 12 22C15.87 22 19 18.64 19 14.5C19 9.5 12 2 12 2Z" />
                                        </svg>
                                        Blood Type
                                    </label>
                                    <input
                                        id="review-bloodtype"
                                        type="text"
                                        className="review-input review-input-readonly"
                                        value={profile?.bloodGroup || 'N/A'}
                                        readOnly
                                    />
                                </div>

                                {/* Visit Type (required) */}
                                <div className="form-group-review">
                                    <label className="review-label" htmlFor="review-visittype">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="blood-icon">
                                            <path d="M3 12h2l3-9 4 18 3-9h2" />
                                        </svg>
                                        Visit Type <span className="required-star">*</span>
                                    </label>
                                    <select
                                        id="review-visittype"
                                        className="review-select"
                                        value={visitType}
                                        onChange={(e) => setVisitType(e.target.value)}
                                    >
                                        {VISIT_TYPE_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Appointment Notes (editable) */}
                                <div className="form-group-review">
                                    <label className="review-label">
                                        Appointment Notes (Optional)
                                    </label>
                                    <textarea
                                        id="review-notes"
                                        className="review-textarea"
                                        placeholder="Describe your symptoms, allergies, or anything the doctor should know..."
                                        value={appointmentNotes}
                                        onChange={(e) => setAppointmentNotes(e.target.value)}
                                        maxLength={500}
                                    />
                                    <span className="notes-char-count">
                                        {appointmentNotes.length}/500
                                    </span>
                                </div>

                            </div>

                            {/* RIGHT SUMMARY */}
                            <div className="review-summary-section">

                                <div className="summary-card-inner">

                                    <h3>Your Appointment</h3>

                                    <div className="summary-doctor-preview">
                                        <img
                                            src={
                                                bookingData.doctorImage ||
                                                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150"
                                            }
                                            alt="Doctor"
                                            className="summary-doc-img"
                                        />

                                        <div className="summary-doc-details">
                                            <h4>{bookingData.doctorName}</h4>
                                            <p>{bookingData.specialtyName}</p>
                                        </div>
                                    </div>

                                    <div className="summary-date-time">
                                        <div className="summary-dt-row">
                                            <CalendarDaysIcon />
                                            {bookingData.date}
                                        </div>

                                        <div className="summary-dt-row">
                                            <ClockIcon />
                                            {bookingData.time}
                                        </div>

                                        <div className="summary-dt-row">
                                            <MapPinIcon />
                                            {bookingData.hospitalName}
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="review-actions">

                        <button
                            className="btn-review-back"
                            disabled={loading}
                            onClick={() =>
                                navigate('/patient/appointments/book/datetime')
                            }
                        >
                            Back
                        </button>

                        <button
                            className="btn-review-confirm"
                            disabled={loading || !isReady}
                            onClick={handleConfirmBooking}
                        >
                            {loading ? (
                                <>
                                    <span className="btn-spinner" />
                                    Confirming...
                                </>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReviewConfirm;