import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingStepper from '../../components/BookingStepper';
import { usePatient } from '../../context/PatientContext';
import appointmentService from '../../services/appointmentService';
import Loader from '../../../components/Loader';

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

import {
    addMonths,
    subMonths,
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    startOfWeek,
    endOfWeek,
    isSameMonth
} from 'date-fns';

import '../../styles/SelectSpecialty.css';
import '../../styles/SelectDateTime.css';

const SelectDateTime = () => {
    const navigate = useNavigate();
    const { bookingData, setBookingData } = usePatient();

    const doctorId = bookingData?.doctorId || null;

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDateObj, setSelectedDateObj] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const [availableDates, setAvailableDates] = useState([]);
    const [currentSlots, setCurrentSlots] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!doctorId) {
            setLoading(false);
            return;
        }

        const fetchAvailableDates = async () => {
            try {
                const data = await appointmentService.getAvailableDates(doctorId);
                // Handle different possible response formats (array of strings or objects)
                const datesList = Array.isArray(data) 
                    ? data.map(d => typeof d === 'string' ? d : (d.date || d.Date || '')).filter(Boolean)
                    : [];
                
                setAvailableDates(datesList);
            } catch (err) {
                console.error("Failed to fetch available dates:", err);
                setError('Could not load available dates. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableDates();
    }, [doctorId]);

    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const handleSelectDate = async (date) => {
        setSelectedDateObj(date);
        setSelectedTime(null);
        setCurrentSlots([]);

        const formattedDate = format(date, 'yyyy-MM-dd');

        try {
            setSlotsLoading(true);
            const data = await appointmentService.getAvailableSlots(doctorId, formattedDate);
            // Handle different possible response formats
            let slotsList = [];
            if (Array.isArray(data)) {
                slotsList = data.map(s => typeof s === 'string' ? s : (s.time || s.Time || s.slot || '')).filter(Boolean);
            } else if (data && data.availableTimes && Array.isArray(data.availableTimes)) {
                slotsList = data.availableTimes.map(s => typeof s === 'string' ? s : (s.time || s.Time || s.slot || '')).filter(Boolean);
            }
                
            setCurrentSlots(slotsList);
        } catch (err) {
            console.error("Failed to fetch slots:", err);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleNextStep = () => {
        if (!selectedDateObj || !selectedTime) return;

        setBookingData(prev => ({
            ...prev,
            date: format(selectedDateObj, 'MMM dd, yyyy'),
            dateIso: format(selectedDateObj, 'yyyy-MM-dd'),
            time: selectedTime
        }));

        navigate('/patient/appointments/book/confirm');
    };

    return (
        <div className="booking-layout">
            <div className="booking-header">
                <h2 className="booking-title">Book a New Appointment</h2>
                <p className="booking-subtitle">
                    Choose specialty, doctor, and time — confirm in one step.
                </p>
            </div>

            <BookingStepper currentStep={3} />

            <div className="booking-wizard-wrapper">
                {!doctorId ? (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <p>No doctor selected. Please go back.</p>
                        <button
                            className="btn-wizard-next"
                            onClick={() => navigate('/patient/appointments/book/doctor')}
                        >
                            Go Back
                        </button>
                    </div>
                ) : loading ? (
                    <Loader />
                ) : error ? (
                    <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
                        {error}
                    </div>
                ) : (
                    <div className="datetime-card">

                        {/* LEFT - CALENDAR */}
                        <div className="calendar-section">
                            <div className="calendar-header">
                                <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                                    <ChevronLeftIcon />
                                </button>

                                <h3 className="calendar-month">
                                    {format(currentMonth, 'MMMM yyyy')}
                                </h3>

                                <button className="calendar-nav-btn" onClick={handleNextMonth}>
                                    <ChevronRightIcon />
                                </button>
                            </div>

                            <div className="calendar-grid">
                                {daysOfWeek.map(day => (
                                    <div key={day} className="calendar-day-header">{day}</div>
                                ))}

                                {days.map((day, i) => {
                                    const formattedDay = format(day, 'yyyy-MM-dd');
                                    // Check if the backend returned this date as available
                                    const isAvailable = availableDates.some(d => d.startsWith(formattedDay));
                                    
                                    const isDisabled = !isSameMonth(day, monthStart) || !isAvailable;
                                    const isSelected = selectedDateObj && isSameDay(day, selectedDateObj);

                                    return (
                                        <button
                                            key={i}
                                            disabled={isDisabled}
                                            className={`calendar-day-btn ${isDisabled ? 'disabled' : ''} ${isSelected && !isDisabled ? 'active' : ''}`}
                                            onClick={() => handleSelectDate(day)}
                                        >
                                            {format(day, 'd')}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="location-note">
                                <MapPinIcon />
                                {bookingData?.hospitalName || 'Central Clinic'}
                            </div>
                        </div>

                        {/* RIGHT - TIME */}
                        <div className="time-slots-section">
                            <h3 className="time-slots-header">
                                {selectedDateObj
                                    ? `Available Slots for ${format(selectedDateObj, 'MMM d, yyyy')}`
                                    : 'Select a date'}
                            </h3>

                            <div className="time-grid">
                                {!selectedDateObj ? (
                                    <p style={{ gridColumn: '1 / -1', color: '#64748b' }}>
                                        Please select an available date from the calendar.
                                    </p>
                                ) : slotsLoading ? (
                                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
                                        <div className="btn-spinner" style={{ borderColor: '#0ea5e9', borderTopColor: 'transparent' }} />
                                    </div>
                                ) : currentSlots.length > 0 ? (
                                    currentSlots.map((time, i) => (
                                        <button
                                            key={i}
                                            className={`time-slot-btn-large ${selectedTime === time ? 'selected' : ''}`}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {time}
                                        </button>
                                    ))
                                ) : (
                                    <p style={{ gridColumn: '1 / -1', color: '#64748b' }}>
                                        No slots available for this day.
                                    </p>
                                )}
                            </div>

                            <p className="time-footer-note">
                                All slots are 30 minutes.
                            </p>

                            <div className="datetime-footer">
                                <button
                                    className="btn-wizard-next"
                                    disabled={!selectedTime || !selectedDateObj}
                                    onClick={handleNextStep}
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectDateTime;