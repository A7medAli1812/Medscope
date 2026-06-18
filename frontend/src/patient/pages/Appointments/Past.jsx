import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import AppointmentCard from '../../components/AppointmentCard';
import appointmentService from '../../services/appointmentService';
import Loader from '../../../components/Loader';
import '../../styles/Appointments.css';

const Past = () => {
    const navigate = useNavigate();
    const [pastAppointments, setPastAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPast = async () => {
            try {
                const data = await appointmentService.getPast();
                setPastAppointments(data || []);
            } catch (err) {
                console.error("Failed to fetch past appointments:", err);
                setError('Could not load past appointments.');
            } finally {
                setLoading(false);
            }
        };
        fetchPast();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="appointments-container">

            {/* Action Bar */}
            <div className="appointments-action-bar">
                <div className="appointments-tabs">
                    <NavLink to="/patient/appointments/upcoming" className="tab-link">
                        Upcoming
                    </NavLink>
                    <NavLink to="/patient/appointments/past" className="tab-link active">
                        Past Appointments
                    </NavLink>
                </div>

                <button
                    className="btn-book-new"
                    onClick={() => navigate('/patient/appointments/book/hospital')}
                >
                    <PlusIcon />
                    Book a New Appointment
                </button>
            </div>

            {error && <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</div>}

            {/* Grid Layout */}
            {!error && (
                pastAppointments.length > 0 ? (
                    <div className="appointments-grid">
                        {pastAppointments.map((appt) => (
                            <AppointmentCard key={appt.id} data={appt} isPast={true} />
                        ))}
                    </div>
                ) : (
                    <div className="btn-empty-state" style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
                        <p>No past appointments found.</p>
                    </div>
                )
            )}

        </div>
    );
};

export default Past;