import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { usePatient } from '../../context/PatientContext';
import appointmentService from '../../services/appointmentService';
import Loader from '../../../components/Loader';
import '../../styles/SelectHospital.css';

const SelectHospital = () => {
    const navigate = useNavigate();
    const { setBookingData } = usePatient();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const data = await appointmentService.getHospitals();
                setHospitals(data || []);
            } catch (err) {
                console.error("Failed to fetch hospitals:", err);
                setError('Could not load hospitals. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchHospitals();
    }, []);

    const handleSelectHospital = (hospital) => {
        setBookingData(prev => ({
            ...prev,
            hospitalId: hospital.id,
            hospitalName: hospital.name
        }));
        navigate('/patient/appointments/book/specialty');
    };

    return (
        <div className="hospital-selection-container">
            <div className="hospital-title-wrapper">
                <h2 className="hospital-title">Select a hospital to book a new appointment</h2>
            </div>
            
            {loading && <Loader />}
            {error && <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</div>}

            {!loading && !error && (
                <div className="hospital-grid">
                    {hospitals.length === 0 ? (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No hospitals available.</p>
                    ) : (
                        hospitals.map(hospital => (
                            <div key={hospital.id} className="hospital-card" onClick={() => handleSelectHospital(hospital)}>
                                <img
                                    src={hospital.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800"}
                                    alt={hospital.name}
                                    className="hospital-image"
                                />
                                <div className="hospital-overlay">
                                    <div className="hospital-name-badge">
                                        {hospital.name}
                                    </div>
                                    <div className="hospital-location">
                                        <MapPinIcon /> {hospital.location || 'Location missing'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectHospital;