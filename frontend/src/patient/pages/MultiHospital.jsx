import React, { useState, useEffect } from 'react';
import MultiHospitalCard from '../components/MultiHospitalCard';
import Loader from '../../components/Loader';
import { getMultiHospitals } from '../services/multiHospitalService';
import '../styles/MultiHospital.css';


const MultiHospital = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMultiHospitals();
            setHospitals(data);
        } catch (err) {
            console.error('Failed to load hospitals:', err);
            setError('Could not fetch hospital bed data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="mh-loading-state">
                <Loader message="Fetching real-time bed availability..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mh-error-state">
                <div className="mh-error-icon">⚠️</div>
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button className="mh-retry-btn" onClick={fetchData}>Try Again</button>
            </div>
        );
    }

    if (hospitals.length === 0) {
        return (
            <div className="mh-empty-state">
                <div className="mh-empty-icon">🏥</div>
                <h3>No Hospital Data Found</h3>
                <p>We couldn't find any hospitals with bed availability data at the moment.</p>
                <button className="mh-retry-btn" onClick={fetchData}>Check Again</button>
            </div>
        );
    }

    return (
        <>

        <div className="mh-page-wrapper">
            <div className="mh-page-header">
                <p className="mh-last-updated">
                    Real-time bed availability across hospitals
                </p>
                <button className="mh-refresh-btn" onClick={fetchData} title="Refresh Data">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                        <path d="M21 3v5h-5"></path>
                    </svg>
                    Refresh
                </button>
            </div>

            <div className="mh-container">
                {hospitals.map((hospital) => (
                    <MultiHospitalCard key={hospital.id} hospital={hospital} />
                ))}
            </div>
        </div>
        </>
    );
};

export default MultiHospital;