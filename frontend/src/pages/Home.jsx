import React from "react";
import "./Home.css";

const Home = () => {
    return (
        <div className="home-container">
            {/* Top Header Section */}
            <div className="home-header">
                <h1 className="page-title">Home</h1>
                <div className="user-profile">
                    <div className="notification-icon">
                        <span className="dot"></span>
                        <i className="fas fa-bell"></i>
                    </div>
                    <div className="user-info">
                        {/* Using a placeholder for the avatar image if you don't have one */}
                        <img src="https://ui-avatars.com/api/?name=Jonitha+Admin&background=0D8ABC&color=fff" alt="User" className="user-avatar" />
                        <div className="user-text">
                            <span className="user-name">Jonitha</span>
                            <span className="user-role">Admin</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Hospital Card */}
            <div className="hospital-card">
                <div className="card-header">
                    <i className="fas fa-hospital-alt card-icon"></i>
                    <h2>Al Haya</h2>
                </div>

                <div className="card-content">
                    <div className="hospital-details">
                        <h3>Metropolitan General Hospital</h3>

                        <div className="detail-row">
                            <i className="fas fa-user-md"></i>
                            <span>125 Doctors</span>
                        </div>

                        <div className="detail-row">
                            <i className="fas fa-building"></i>
                            <span>18 Medical Departments</span>
                        </div>

                        <div className="detail-row">
                            <i className="fas fa-phone-alt"></i>
                            <span>(555)123-4567</span>
                        </div>

                        <div className="detail-row">
                            <i className="fas fa-envelope"></i>
                            <span>info@metrogeneralhospital.com</span>
                        </div>

                        <div className="detail-row">
                            <i className="fas fa-globe"></i>
                            <span>www.metrogeneralhospitalcom</span>
                        </div>
                    </div>

                    <div className="specialties-section">
                        <h3>Available Specialties</h3>
                        <div className="specialties-grid">
                            <div className="specialty-item"><span className="bullet"></span>Cardiology</div>
                            <div className="specialty-item"><span className="bullet"></span>Neurology</div>
                            <div className="specialty-item"><span className="bullet"></span>Orthopedics</div>
                            <div className="specialty-item"><span className="bullet"></span>Pediatrics</div>
                            <div className="specialty-item"><span className="bullet"></span>Emergency Medicine</div>
                            <div className="specialty-item"><span className="bullet"></span>Internal Medicine</div>
                            <div className="specialty-item"><span className="bullet"></span>DermatoLogy</div>
                            <div className="specialty-item"><span className="bullet"></span>RadioLogy</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Cards */}
            <div className="bottom-cards">
                <div className="status-card">
                    <div className="icon-circle">
                        <i className="fas fa-hospital-user"></i>
                    </div>
                    <p>Metropolitan General</p>
                    <h4>Your Hospital</h4>
                </div>

                <div className="status-card">
                    <div className="icon-circle">
                        <i className="fas fa-bell"></i>
                    </div>
                    <p className="big-number">3</p>
                    <p>New Notifications</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
