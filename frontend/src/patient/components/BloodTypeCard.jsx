import React from 'react';

const BloodTypeCard = ({ type, units }) => {
    const getStatus = (count) => {
        if (count > 40) return { label: 'High', cls: 'high' };
        if (count >= 20) return { label: 'Medium', cls: 'medium' };
        return { label: 'Low', cls: 'low' };
    };

    const status = getStatus(units);

    return (
        <div className="blood-type-card">
            <span className="blood-type-label">{type}</span>
            <span className="blood-type-units">{units}</span>
            <span className={`status-badge ${status.cls}`}>{status.label}</span>
        </div>
    );
};

export default BloodTypeCard;
