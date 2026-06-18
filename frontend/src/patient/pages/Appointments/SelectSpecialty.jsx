import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingStepper from '../../components/BookingStepper';
import { usePatient } from '../../context/PatientContext';
import appointmentService from '../../services/appointmentService';
import Loader from '../../../components/Loader';
import {
    MagnifyingGlassIcon,
    HeartIcon,
    UserIcon,
    EyeIcon,
    SparklesIcon,
    FaceSmileIcon
} from '@heroicons/react/24/outline';
import '../../styles/SelectSpecialty.css';

const getSpecialtyIcon = (name) => {
    const lName = (name || '').toLowerCase();
    if (lName.includes('cardiol')) return <HeartIcon className="specialty-icon" />;
    if (lName.includes('ophthal')) return <EyeIcon className="specialty-icon" />;
    if (lName.includes('derma')) return <SparklesIcon className="specialty-icon" />;
    if (lName.includes('pedia') || lName.includes('psych')) return <FaceSmileIcon className="specialty-icon" />;
    return <UserIcon className="specialty-icon" />; // Fallback
};

const SelectSpecialty = () => {
    const navigate = useNavigate();
    const { bookingData, setBookingData } = usePatient();

    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const data = await appointmentService.getSpecialties(bookingData?.hospitalId);
                setSpecialties(data || []);
            } catch (err) {
                console.error("Failed to fetch specialties:", err);
                setError('Could not load specialties. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchSpecialties();
    }, []);

    const filteredSpecialties = specialties.filter(spec => {
        const name = typeof spec === 'string' ? spec : spec.name || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleNext = () => {
        if (!selectedSpecialty) return;
        const name = typeof selectedSpecialty === 'string' ? selectedSpecialty : selectedSpecialty.name;
        const id = typeof selectedSpecialty === 'string' ? selectedSpecialty : selectedSpecialty.id;

        setBookingData(prev => ({
            ...prev,
            specialtyId: id,
            specialtyName: name
        }));
        navigate('/patient/appointments/book/doctor');
    };

    return (
        <div className="booking-layout">

            <div className="booking-header">
                <h2 className="booking-title">Book a New Appointment</h2>
                <p className="booking-subtitle">Choose specialty, doctor, and time — confirm in one step.</p>
            </div>

            <BookingStepper currentStep={1} />

            <div className="booking-wizard-wrapper">

                <div className="specialty-search-wrapper">
                    <MagnifyingGlassIcon className="specialty-search-icon" />
                    <input
                        type="text"
                        className="specialty-search-input"
                        placeholder="Search specialties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading && <Loader />}
                {error && <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</div>}

                {!loading && !error && (
                    <div className="specialty-grid">
                        {filteredSpecialties.map((spec, index) => {
                            const name = typeof spec === 'string' ? spec : spec.name;
                            const id = typeof spec === 'string' ? spec : spec.id;
                            const isSelected = selectedSpecialty === spec || selectedSpecialty?.id === id;

                            return (
                                <div
                                    key={id || index}
                                    className={`specialty-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedSpecialty(spec)}
                                >
                                    {getSpecialtyIcon(name)}
                                    <span className="specialty-name">{name}</span>
                                </div>
                            );
                        })}
                        {filteredSpecialties.length === 0 && (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No specialties found.</p>
                        )}
                    </div>
                )}

                <div className="booking-actions">
                    <button
                        className="btn-wizard-next"
                        disabled={!selectedSpecialty}
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SelectSpecialty;