import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope, faClock, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Home/Home.css';

const Features = () => {
  return (
    <div id="about" className="home-section">
      <div style={{ marginBottom: '20px' }}>
        <span className="home-badge-blue">
          WHAT MEDSCOPE OFFERS
        </span>
      </div>
      <h2 className="home-section-title">Modern Healthcare<br />Management</h2>
      <p className="home-section-subtitle">
        Our comprehensive platform of seamless hospital operations and enhances patient care. 
        MANAGE IT CLEARLY. ANYWHERE, ANYTIME.
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faStethoscope} />
          </div>
          <h3>Expert Medical Care</h3>
          <p>Access to top-tier healthcare professionals and advanced medical facilities to ensure you receive the best possible care.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <h3>24/7 Availability</h3>
          <p>Round-the-clock access to emergency services and patient care because health issues don't follow a schedule.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faShieldAlt} />
          </div>
          <h3>Secure Platform</h3>
          <p>Your privacy is our priority. Our platform ensures that your medical information remains strictly confidential and secure.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
