import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HospitalCard from '../components/HospitalCard';
import Loader from '../../components/Loader';
import { getHospitals } from '../services/bloodBankService';
import '../styles/BloodBank.css';



const BloodBank = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortMethod, setSortMethod] = useState('none');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getHospitals();
                setHospitals(data);
            } catch (err) {
                console.error('Failed to load hospitals:', err);
                setError('Could not establish connection to the Blood Bank database. It may be offline.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getProcessedHospitals = () => {
        let result = hospitals.filter((h) => {
            if (!h) return false;
            
            // Check if searchQuery is an exact blood type (A+, O-, AB+, etc)
            const isBloodTypeSearch = /^(A|B|AB|O)[+-]$/i.test(searchQuery.trim());
            
            if (isBloodTypeSearch) {
                const bt = searchQuery.trim().toUpperCase();
                return h.bloodTypes && h.bloodTypes[bt] && h.bloodTypes[bt] > 0;
            }
            
            return h.name?.toLowerCase().includes(searchQuery.toLowerCase());
        });

        if (sortMethod === 'highest' || sortMethod === 'lowest') {
            result = [...result].sort((a, b) => {
                const totalA = a.bloodTypes ? Object.values(a.bloodTypes).reduce((s, v) => s + (Number(v)||0), 0) : 0;
                const totalB = b.bloodTypes ? Object.values(b.bloodTypes).reduce((s, v) => s + (Number(v)||0), 0) : 0;
                return sortMethod === 'highest' ? totalB - totalA : totalA - totalB;
            });
        } else if (sortMethod === 'name') {
            result = [...result].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }

        return result;
    };

    const processed = getProcessedHospitals();

    /* Loading state uses the shared Loader component */
    if (loading) {
        return (
            <div style={{ position: 'relative', width: '100%', minHeight: '50vh' }}>
                <Loader message="Loading Blood Bank Data..." />
            </div>
        );
    }

    return (
        <>


        <div className="bloodbank-container">
            <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortMethod={sortMethod}
                setSortMethod={setSortMethod}
            />

            <div className="bb-hospital-grid">
                {error ? (
                    <div className="bb-empty-state" style={{ color: '#991b1b', gridColumn: '1 / -1' }}>
                        {error}
                    </div>
                ) : processed.length > 0 ? (
                    processed.map((hospital, idx) => (
                        <HospitalCard key={hospital.id || idx} hospital={hospital} />
                    ))
                ) : (
                    <div className="bb-empty-state" style={{ gridColumn: '1 / -1' }}>
                        No blood bank records match your search criteria.
                    </div>
                )}
            </div>
        </div> 
        </>
    );
};

export default BloodBank;
