import React, { useEffect, useState } from "react";
import "../styles/BedManagement.css";
import { getBeds, increaseBed, decreaseBed } from "../services/bedManagement";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBed, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/Loader";

const BedManagement = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Retrieve user details from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || "Admin";
  const userRole = user.role || "Admin";

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const data = await getBeds();
      
      // Trust the API math completely
      const safeData = data.map(bed => {
        return {
          ...bed
        };
      });

      setBeds(safeData);
    } catch (err) {
      toast.error("Failed to load beds: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  const handleIncrease = async (bed) => {
    if (bed.usedBeds >= bed.totalBeds) {
      toast.error("All beds are currently occupied");
      return;
    }

    try {
      setUpdatingId(bed.id);

      // Optimistic update
      setBeds((prev) =>
        prev.map((b) =>
          b.id === bed.id
            ? { ...b, usedBeds: b.usedBeds + 1, availableBeds: b.availableBeds - 1 }
            : b
        )
      );

      // We want to increase OCCUPIED beds, which means DECREASING available beds on the backend
      await decreaseBed(bed.id);
      toast.success(`${bed.ward} bed count increased`);
    } catch (err) {
      console.error("Error increasing bed:", err);
      toast.error("API Error: " + err.message);
      fetchBeds(); // Rollback
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDecrease = async (bed) => {
    if (bed.usedBeds <= 0) {
      toast.error("No occupied beds to release");
      return;
    }

    try {
      setUpdatingId(bed.id);

      // Optimistic update
      setBeds((prev) =>
        prev.map((b) =>
          b.id === bed.id
            ? { ...b, usedBeds: b.usedBeds - 1, availableBeds: b.availableBeds + 1 }
            : b
        )
      );

      // We want to decrease OCCUPIED beds, which means INCREASING available beds on the backend
      await increaseBed(bed.id);
      toast.success(`${bed.ward} bed count decreased`);
    } catch (err) {
      console.error("Error decreasing bed:", err);
      toast.error("API Error: " + err.message);
      fetchBeds(); // Rollback
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-bed-page">
      {loading && <Loader message="Loading bed statistics..." />}

      {/* Top Profile Header */}
      <div className="admin-bed-header-block">
        <h2 className="admin-bed-page-title">Bed Management</h2>
        <div className="admin-bed-profile-area">
          <div className="notification-bell-container">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            <span className="bell-badge"></span>
          </div>
          <div className="admin-bed-profile-details">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">{userRole}</span>
          </div>
        </div>
      </div>

      {/* Card Wrapper */}
      <div className="admin-bed-card-wrapper">
        {/* Tabs */}
        <div className="admin-bed-card-header">
          <div className="admin-bed-tab-active">Bed info</div>
        </div>

        {/* Content/Grid */}
        <div className="admin-bed-grid">
          {beds.map((bed, index) => {
              const percentage =
                bed.totalBeds === 0 ? 0 : (bed.usedBeds / bed.totalBeds) * 100;

              const isMax = bed.usedBeds >= bed.totalBeds;
              const isMin = bed.usedBeds <= 0;
              const isUpdating = updatingId === bed.id;

              return (
                <div
                  key={`${bed.ward}-${index}`}
                  className={`admin-bed-card ${isUpdating ? "admin-bed-updating" : ""}`}
                >
                  <div className="admin-bed-card-top">
                    {/* Ward Info */}
                    <div className="admin-bed-ward-info">
                      <div className="admin-bed-icon-circle">
                        <FontAwesomeIcon icon={faBed} className="admin-bed-fa-icon" />
                      </div>
                      <h3 className="admin-bed-ward-name">{bed.ward}</h3>
                    </div>

                    {/* Controls & Count */}
                    <div className="admin-bed-controls-section">
                      <span className="admin-bed-count-text">
                        {bed.usedBeds}/{bed.totalBeds}
                      </span>
                      <div className="admin-bed-arrows-stack">
                        <button
                          type="button"
                          className={`admin-bed-arrow-btn ${isMax ? "disabled" : ""}`}
                          onClick={() => !isMax && !isUpdating && handleIncrease(bed)}
                          disabled={isMax || isUpdating}
                          title="Increase occupied beds"
                        >
                          <FontAwesomeIcon icon={faChevronUp} />
                        </button>
                        <button
                          type="button"
                          className={`admin-bed-arrow-btn ${isMin ? "disabled" : ""}`}
                          onClick={() => !isMin && !isUpdating && handleDecrease(bed)}
                          disabled={isMin || isUpdating}
                          title="Decrease occupied beds"
                        >
                          <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="admin-bed-progress-container">
                    <div
                      className="admin-bed-progress-fill"
                      style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

export default BedManagement;
