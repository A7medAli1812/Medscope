import React from 'react';
import '../../styles/Home/Home.css';
import partner1Img from '../../assets/images/home/partner-1.jpg';

const Partners = () => {
  return (
    <div id="hospitals" className="home-section partners-section">
      <div style={{ marginBottom: '20px' }}>
        <span className="home-badge-white">
          PARTNERS
        </span>
      </div>
      <h2 className="home-section-title">Partner Hospitals</h2>
      <p className="home-section-subtitle">
        Trusted healthcare facilities in our network providing exceptional medical care.
      </p>

      <div className="partners-grid">
        <div className="partner-card">
          <img 
            src={partner1Img} 
            alt="City General Hospital" 
            className="partner-img"
          />
          <div className="partner-overlay">
            <h3>City General Hospital</h3>
            <p>123 Healthcare Ave, NY</p>
          </div>
        </div>

        <div className="partner-card">
          <img 
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop" 
            alt="Metro Medical Center" 
            className="partner-img"
          />
          <div className="partner-overlay">
            <h3>Metro Medical Center</h3>
            <p>456 Wellness Blvd, CA</p>
          </div>
        </div>
      </div>

      <button className="view-all-btn">
        View All Partner Hospitals &rarr;
      </button>
    </div>
  );
};

export default Partners;
