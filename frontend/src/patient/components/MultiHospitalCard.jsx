import React from 'react';

const MultiHospitalCard = ({ hospital }) => {
    return (
        <div className="mh-card">
            {/* Hospital Header */}
            <div className="mh-card-header">
                <div className="mh-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5Z" />
                    </svg>
                </div>
                <h3 className="mh-hospital-name">{hospital.name}</h3>
            </div>

            {/* Bed Rows */}
            <div className="mh-bed-list">
                {hospital.beds.map((bed, index) => {
                    const total = bed.total || 0;
                    const occupied = bed.occupied || 0;
                    const available = total - occupied;
                    const percentage = total > 0 ? Math.min(Math.round((occupied / total) * 100), 100) : 0;
                    
                    // Determine color based on availability
                    let statusClass = '';
                    if (total === 0) statusClass = 'status-empty';
                    else if (percentage >= 90) statusClass = 'status-critical';
                    else if (percentage >= 70) statusClass = 'status-warning';
                    else statusClass = 'status-good';

                    return (
                        <div className={`mh-bed-row ${statusClass}`} key={index}>
                            <div className="mh-bed-info">
                                <span className={`mh-bed-label ${index > 0 ? 'mh-bed-label--teal' : ''}`}>
                                    {bed.type}
                                </span>
                                <span className="mh-bed-count">
                                    {occupied}/{total} <small>beds</small>
                                </span>
                            </div>
                            
                            <div className="mh-progress-container">
                                <div className="mh-progress-track">
                                    <div
                                        className="mh-progress-fill"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="mh-availability-text">
                                    {total > 0 ? `${available} available` : 'N/A'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MultiHospitalCard;

