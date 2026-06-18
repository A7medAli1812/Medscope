import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import AppointmentCard from '../../components/AppointmentCard';
import appointmentService from '../../services/appointmentService';
import Loader from '../../../components/Loader';
import Swal from 'sweetalert2';
import '../../styles/Appointments.css';

const Upcoming = () => {
    const navigate = useNavigate();
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const data = await appointmentService.getUpcoming();
                setUpcomingAppointments(data || []);
            } catch (err) {
                console.error("Failed to fetch upcoming appointments:", err);
                setError('Could not load appointments.');
            } finally {
                setLoading(false);
            }
        };
        fetchUpcoming();
    }, []);

    const handleCancel = async (id) => {
        const result = await Swal.fire({
            title: 'Cancel Appointment?',
            text: "Are you sure you want to cancel this appointment?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                await appointmentService.cancelAppointment(id);
                setUpcomingAppointments(prev => prev.filter(appt => appt.id !== id));
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'Your appointment has been cancelled.',
                    icon: 'success',
                    confirmButtonColor: '#0ea5e9'
                });
            } catch (err) {
                console.error("Failed to cancel appointment:", err);
                Swal.fire({
                    title: 'Error!',
                    text: 'Could not cancel the appointment. Please try again later.',
                    icon: 'error',
                    confirmButtonColor: '#0ea5e9'
                });
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="appointments-container">

            {/* Action Bar */}
            <div className="appointments-action-bar">
                <div className="appointments-tabs">
                    <NavLink to="/patient/appointments/upcoming" className="tab-link active">
                        Upcoming
                    </NavLink>
                    <NavLink to="/patient/appointments/past" className="tab-link">
                        Past Appointments
                    </NavLink>
                </div>

                <button
                    className="btn-book-new"
                    onClick={() => navigate('/patient/appointments/hospital')}
                >
                    <PlusIcon />
                    Book a New Appointment
                </button>
            </div>

            {error && <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</div>}

            {/* Grid Layout */}
            {!error && (
                upcomingAppointments.length > 0 ? (
                    <div className="appointments-grid">
                        {upcomingAppointments.map((appt) => (
                            <AppointmentCard 
                                key={appt.id} 
                                data={appt} 
                                isPast={false} 
                                onCancel={handleCancel}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="btn-empty-state" style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
                        <p>No upcoming appointments found.</p>
                    </div>
                )
            )}

        </div>
    );
};

export default Upcoming;