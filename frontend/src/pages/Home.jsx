import React, { useState } from "react";
import axiosInstance from "../api/axios";
import "./Home.css";

const Home = () => {

    const [hospital] = useState({
        name: "Al Haya",
        hospitalName: "Metropolitan General Hospital",
        doctors: 125,
        departments: 18,
        phone: "(555)123-4567",
        email: "info@metrogeneralhospital.com",
        website: "www.metrogeneralhospital.com"
    });

    const [notifications] = useState(3);

    const specialties = [
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Emergency Medicine",
        "Internal Medicine",
        "Dermatology",
        "Radiology"
    ];

    return (
        <div className="home-container">

            {/* Header */}
            <div className="home-header">

                <h1 className="page-title">Home</h1>

                <div className="user-profile">

                    <div className="notification-icon">
                        <span className="dot"></span>
                        <i className="fas fa-bell"></i>
                    </div>

                    <div className="user-info">

                        <img
                            src="https://ui-avatars.com/api/?name=Jonitha+Admin&background=0D8ABC&color=fff"
                            alt="User"
                            className="user-avatar"
                        />

                        <div className="user-text">
                            <span className="user-name">Jonitha</span>
                            <span className="user-role">Admin</span>
                        </div>

                    </div>

                </div>

            </div>


            {/* Hospital Card */}

            <div className="hospital-card">

                <div className="card-header">

                    <i className="fas fa-hospital-alt card-icon"></i>
                    <h2>{hospital.name}</h2>

                </div>


                <div className="card-content">

                    <div className="hospital-details">

                        <h3>{hospital.hospitalName}</h3>

                        <div className="detail-row">
                            <i className="fas fa-user-md"></i>
                            <span>{hospital.doctors} Doctors</span>
                        </div>

                        <div className="detail-row">
                            <i className="fas fa-building"></i>
                            <span>{hospital.departments} Medical Departments</span>
                        </div>

                        <div className="detail-row">
                            <i className="fas fa-phone-alt"></i>
                            <span>{hospital.phone}</span>
                        </div>

                        <div className="detail-row">
                            <i className="fas fa-envelope"></i>
                            <span>{hospital.email}</span>
                        </div>

                        <div className="detail-row">
                            <i className="fas fa-globe"></i>
                            <span>{hospital.website}</span>
                        </div>

                    </div>



                    {/* Specialties */}

                    <div className="specialties-section">

                        <h3>Available Specialties</h3>

                        <div className="specialties-grid">

                            {specialties.map((item, index) => (

                                <div className="specialty-item" key={index}>

                                    <span className="bullet"></span>

                                    {item}

                                </div>

                            ))}

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

                    <p>{hospital.hospitalName}</p>

                    <h4>Your Hospital</h4>

                </div>


                <div className="status-card">

                    <div className="icon-circle">
                        <i className="fas fa-bell"></i>
                    </div>

                    <p className="big-number">{notifications}</p>

                    <p>New Notifications</p>

                </div>

            </div>

        </div>
    );
};

export default Home;