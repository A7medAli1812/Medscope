import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faTint, faCalendarCheck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Home/Home.css';
import managementImg from '../../assets/images/home/management-tools.jpg';

const ManagementTools = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/'); // Redirect to the main login page
  };

  return (
    <div className="home-section management-tools-section">
      <div style={{ marginBottom: '20px' }}>
        <span className="platform-services-badge">
          Platform Services
        </span>
      </div>
      <h2 className="home-section-title">Comprehensive Healthcare<br />Management Tools</h2>
      <div className="title-divider"></div>
      <p className="home-section-subtitle">
        Access powerful healthcare management tools designed to streamline your medical journey.
      </p>

      {/* Main Tool Card */}
      <div className="main-tool-card">
        <img 
          src={managementImg} 
          alt="Doctors examining holographic lungs" 
          className="main-tool-img"
        />
        <div className="main-tool-overlay">
          <div className="main-tool-header">
            <div className="main-tool-calendar-box">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <span className="most-popular-badge">Most Popular</span>
          </div>

          <div className="main-tool-content">
            <h2>Doctor Appointments Booking</h2>
            
            <div className="main-tool-features">
              <span className="feature-item">
                <i className="fas fa-clock feature-icon-red"></i> Instant Booking
              </span>
              <span className="feature-item">
                <i className="fas fa-bell feature-icon-red"></i> Reminders
              </span>
            </div>
          </div>

          <div className="main-tool-footer">
            <button className="login-btn-wide" onClick={handleLoginRedirect}>
              Login to Book &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tools Grid */}
      <div className="sub-tools-grid">
        {/* Beds */}
        <div className="sub-tool-card">
          <div className="sub-tool-icon">
            <FontAwesomeIcon icon={faBed} />
          </div>
          <h3>Available Beds (ICU & Incubators)</h3>
          <div className="sub-tool-features">
            <span><FontAwesomeIcon icon={faCheckCircle} /> Live status</span>
            <span><FontAwesomeIcon icon={faCheckCircle} /> All departments</span>
          </div>
          <button className="login-btn-small" onClick={handleLoginRedirect}>
            Login to View &rarr;
          </button>
        </div>

        {/* Blood Bank */}
        <div className="sub-tool-card">
          <div className="sub-tool-icon">
            <FontAwesomeIcon icon={faTint} />
          </div>
          <h3>Blood Bank</h3>
          <div className="sub-tool-features">
            <span><FontAwesomeIcon icon={faCheckCircle} /> Available quantities</span>
          </div>
          <button className="login-btn-small" onClick={handleLoginRedirect}>
            Login to View Blood &rarr;
          </button>
        </div>

        {/* My Appointments */}
        <div className="sub-tool-card">
          <div className="sub-tool-icon">
            <FontAwesomeIcon icon={faCalendarCheck} />
          </div>
          <h3>My Appointments</h3>
          <div className="sub-tool-features">
            <span><FontAwesomeIcon icon={faCheckCircle} /> History</span>
            <span><FontAwesomeIcon icon={faCheckCircle} /> Upcoming</span>
          </div>
          <button className="login-btn-small" onClick={handleLoginRedirect}>
            Login to Manage Appointments &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagementTools;
