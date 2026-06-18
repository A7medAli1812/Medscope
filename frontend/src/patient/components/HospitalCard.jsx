import React from 'react';
import BloodTypeCard from './BloodTypeCard';

const HospitalCard = ({ hospital }) => {
    const bloodEntries = Object.entries(hospital.bloodTypes);

    return (
        <div className="hospital-card">
            {/* Hospital Info */}
            <div className="hospital-header">
                <h3 className="hospital-name">{hospital.name}</h3>
                <div className="hospital-detail">
                    <svg className="hospital-detail-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span>{hospital.address}</span>
                </div>
                <div className="hospital-detail">
                    <svg className="hospital-detail-icon phone" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.432-4.132-7.028-7.028l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    <span>{hospital.phone}</span>
                </div>
            </div>

            {/* Blood Types */}
            <div className="blood-section-title">
                <svg className="blood-section-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4.97 0 9-4.03 9-9 0-3.83-2.6-8.33-8.66-11.5a1.5 1.5 0 0 0-1.48 0C4.6 3.67 3 8.17 3 12c0 4.97 4.03 9 9 9Z" />
                </svg>
                Available Blood Types
            </div>

            <div className="blood-grid">
                {bloodEntries.map(([type, units]) => (
                    <BloodTypeCard key={type} type={type} units={units} />
                ))}
            </div>
        </div>
    );
};

export default HospitalCard;
