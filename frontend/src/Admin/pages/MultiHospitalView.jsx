import React, { useEffect, useState } from "react";
import "../styles/MultiHospitalView.css";
import { getMultiHospitalBeds } from "../services/hospitalService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHospital } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/Loader";

const MultiHospitalView = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || "Jonitha Cathrine";
  const userRole = user.role || "Admin";
  // Fallback to a placeholder avatar if not provided
  const avatarUrl = user.avatar || "https://randomuser.me/api/portraits/women/44.jpg"; 

  // fetch
  const fetchHospitals = async () => {
    try {
      setError("");
      const res = await getMultiHospitalBeds();
      setHospitals(res || []);
    } catch (err) {
      if (err.response?.status === 500) {
        setError("Server error, try again later");
      } else if (err.response?.status === 401) {
        setError("Unauthorized (login again)");
      } else {
        setError("Failed to load hospitals");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // auto refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchHospitals();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // helpers
  const getPercent = (used, total) => {
    if (!total) return 0;
    return Math.round((used / total) * 100);
  };

  // UI states
  if (loading) return <Loader message="Loading hospitals data..." />;
  if (error) return <div className="multi-page">{error}</div>;

  return (
    <div className="multi-page">
      {/* Top Profile Header */}
      <div className="multi-header-block">
        <h2 className="multi-page-title">Multi-Hospital View</h2>
        <div className="multi-profile-area">
          <div className="notification-bell-container">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            <span className="bell-badge"></span>
          </div>
          <div className="multi-profile-details">
            <div className="profile-text">
              <span className="profile-name">{userName}</span>
              <span className="profile-role">{userRole}</span>
            </div>
          </div>
        </div>
      </div>

      {hospitals.length === 0 && <p>No hospitals found</p>}

      {hospitals.map((hospital, index) => {
        return (
          <div className="hospital-card" key={index}>
            <div className="hospital-header">
              <div className="hospital-icon">
                <FontAwesomeIcon icon={faHospital} />
              </div>
              <h3>{hospital.hospital}</h3>
            </div>

            <div className="beds-container">
              {hospital.beds?.map((bed, i) => {
                const used = bed.totalBeds - bed.availableBeds;
                const total = bed.totalBeds;
                const percent = getPercent(used, total);

                return (
                  <div className="bed-row" key={i}>
                    <div className="bed-text-row">
                      <span className="bed-label">{bed.name}</span>
                      <span className="bed-count-text">
                        {used}/{total} beds
                      </span>
                    </div>
                    <div className="bed-bar-container">
                      <div
                        className="bed-bar-fill"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MultiHospitalView;