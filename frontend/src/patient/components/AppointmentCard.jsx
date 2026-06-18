import React from 'react';
import {
    CalendarDaysIcon,
    ClockIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import '../styles/Appointments.css';

const AppointmentCard = ({ data, isPast, onCancel }) => {

    // Determine badge class
    const getBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'confirmed';
            case 'pending': return 'pending';
            case 'completed': return 'pending';
            case 'cancelled': return 'cancelled';
            default: return 'pending';
        }
    };

    return (
        <div className="appointment-card">

            {/* Top row: Date and Time */}
            <div className="appt-datetime">
                <div className="datetime-row">
                    <CalendarDaysIcon />
                    {data.date}
                </div>
                <div className="datetime-row">
                    <ClockIcon />
                    {data.time}
                </div>
            </div>

            {/* Middle: Doctor Info */}
            <div className="appt-doctor-info">
                <h4 className="doctor-name">
                    <UserIcon />
                    {data.doctorName}
                </h4>
                <p className="doctor-specialty">
                    {data.specialty} <span className="separator">•</span> {data.hospitalName}
                </p>

                <div className="appt-status-row">
                    <span className={`appt-badge ${getBadgeClass(data.status)}`}>
                        {data.status}
                    </span>
                </div>
            </div>

            {/* Bottom Action */}
            {!isPast && data.status.toLowerCase() !== 'cancelled' && (
                <div className="appt-footer">
                    <button 
                        className="btn-cancel-appt"
                        onClick={() => onCancel && onCancel(data.id)}
                    >
                        Cancel Appointment
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentCard;
