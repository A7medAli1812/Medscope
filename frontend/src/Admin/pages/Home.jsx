import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import { getDashboardSummary } from "../services/dashboard";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospital,
  faUserMd,
  faClinicMedical,
  faPhone,
  faEnvelope,
  faGlobe,
  faBell
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/Loader";

const Home = () => {
  const [data, setData] = useState(null);

  // Retrieve user details from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || "Jonitha";
  const userRole = user.role || "Admin";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getDashboardSummary();
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard summary data");
    }
  };

  if (!data) return <Loader message="Loading dashboard summary..." />;

  return (
    <div className="admin-home-container">
      {/* Top Header Section matching the dashboard layout */}
      <div className="admin-home-header-block">
        <h2 className="admin-home-title">Home</h2>
        
        <div className="admin-home-profile-area">
          <div className="notification-bell-container">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            <span className="bell-badge"></span>
          </div>
          <div className="profile-details">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">{userRole}</span>
          </div>
        </div>
      </div>

      {/* Large Hospital Card */}
      <div className="admin-home-card">
        {/* Left Side: Hospital Details */}
        <div className="admin-home-left">
          <div className="admin-home-hospital-header">
            <div className="admin-home-hospital-icon-wrapper">
              <FontAwesomeIcon icon={faHospital} className="admin-home-hospital-icon" />
            </div>
            <div className="admin-home-hospital-title-area">
              <h3 className="admin-home-hospital-name">{data.hospitalName}</h3>
              <p className="admin-home-hospital-type">{data.hospitalType} Hospital</p>
            </div>
          </div>

          <div className="admin-home-info-list">
            <div className="admin-home-info-item">
              <FontAwesomeIcon icon={faUserMd} className="admin-home-info-icon" />
              <span>{data.doctorsCount} Doctors</span>
            </div>
            <div className="admin-home-info-item">
              <FontAwesomeIcon icon={faClinicMedical} className="admin-home-info-icon" />
              <span>{data.departmentsCount} Medical Departments</span>
            </div>
            <div className="admin-home-info-item">
              <FontAwesomeIcon icon={faPhone} className="admin-home-info-icon" />
              <span>{data.phone}</span>
            </div>
            <div className="admin-home-info-item">
              <FontAwesomeIcon icon={faEnvelope} className="admin-home-info-icon" />
              <span>{data.email}</span>
            </div>
            <div className="admin-home-info-item">
              <FontAwesomeIcon icon={faGlobe} className="admin-home-info-icon" />
              <span>{data.website}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Available Specialties */}
        <div className="admin-home-right">
          <h4 className="admin-home-specialties-title">Available Specialties</h4>
          <div className="admin-home-specialties-grid">
            {data.specialties && data.specialties.length > 0 ? (
              data.specialties.map((spec, index) => (
                <div key={index} className="admin-home-specialty-item">
                  <span className="admin-home-specialty-dot"></span>
                  <span>{spec}</span>
                </div>
              ))
            ) : (
              <p className="no-specialties">No specialties listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;