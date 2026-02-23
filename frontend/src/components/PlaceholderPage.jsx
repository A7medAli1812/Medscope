import React from 'react';

const PlaceholderPage = ({ title }) => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#555' }}>
            <h1>{title}</h1>
            <p>This page is under construction.</p>
        </div>
    );
};

export default PlaceholderPage;
