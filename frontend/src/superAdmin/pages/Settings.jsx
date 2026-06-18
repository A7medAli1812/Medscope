import React, { useState, useEffect } from "react";
import "../styles/Settings.css";
import {
  getProfile,
  updateProfile,
  changePassword,
  updateNotifications,
} from "../services/superAdminApi";

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [info, setInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [tempInfo, setTempInfo] = useState({ ...info });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [passMsg, setPassMsg] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  const [notifications, setNotifications] = useState({
    systemErrors: true,
    securityIncidents: false,
    appointmentReminders: true,
  });

  // ========== Fetch Profile ==========
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const data = response.data;
        setInfo({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phoneNumber || "",
        });
        setTempInfo({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phoneNumber || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ========== Edit Profile ==========
  const handleEdit = () => {
    setTempInfo({ ...info });
    setIsEditing(true);
  };

  const handleSaveInfo = async () => {
    try {
      const nameParts = tempInfo.fullName.split(" ");
      await updateProfile({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        phoneNumber: tempInfo.phone,
      });
      setInfo({ ...tempInfo });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data || "Failed to update profile");
    }
  };

  // ========== Change Password ==========
  const handleChangePassword = async () => {
    if (!passwords.current) return setPassMsg("Please enter current password.");
    if (passwords.newPass.length < 6)
      return setPassMsg("New password must be at least 6 characters.");
    if (passwords.newPass !== passwords.confirm)
      return setPassMsg("Passwords don't match.");

    try {
      setSavingPass(true);
      setPassMsg("");
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
        confirmPassword: passwords.confirm,
      });
      setPassMsg("Password changed successfully!");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      console.error("Error changing password:", err);
      const errorMsg = err.response?.data;
      if (typeof errorMsg === "string") {
        setPassMsg(errorMsg);
      } else if (Array.isArray(errorMsg)) {
        setPassMsg(errorMsg.map((e) => e.description || e).join(", "));
      } else {
        setPassMsg("Failed to change password");
      }
    } finally {
      setSavingPass(false);
    }
  };

  // ========== Notifications ==========
  const toggleNotif = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);

    try {
      await updateNotifications({
        systemAlerts: updated.systemErrors,
        securityAlerts: updated.securityIncidents,
        appointmentReminders: updated.appointmentReminders,
      });
    } catch (err) {
      console.error("Error updating notifications:", err);
      // Revert on error
      setNotifications(notifications);
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-subtitle">
          Manage your personal information and settings
        </p>
      </div>

      {/* Personal Information */}
      <div className="settings-card">
        <div className="card-top">
          <h3 className="card-title">Personal Information</h3>
          {!isEditing ? (
            <button className="edit-btn" onClick={handleEdit}>
              <i className="fas fa-edit"></i> Edit
            </button>
          ) : (
            <button className="edit-btn save" onClick={handleSaveInfo}>
              <i className="fas fa-check"></i> Save
            </button>
          )}
        </div>

        <div className="info-grid">
          <div className="info-field">
            <label>
              <i className="fas fa-user"></i> Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempInfo.fullName}
                onChange={(e) =>
                  setTempInfo({ ...tempInfo, fullName: e.target.value })
                }
              />
            ) : (
              <p>{info.fullName}</p>
            )}
          </div>

          <div className="info-field">
            <label>
              <i className="fas fa-envelope"></i> Email
            </label>
            <p className="readonly">{info.email}</p>
          </div>

          <div className="info-field">
            <label>
              <i className="fas fa-phone"></i> Phone Number
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempInfo.phone}
                onChange={(e) =>
                  setTempInfo({ ...tempInfo, phone: e.target.value })
                }
              />
            ) : (
              <p>{info.phone || "Not set"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="settings-card">
        <div className="card-top">
          <h3 className="card-title">Security Settings</h3>
          <button
            className="edit-btn"
            onClick={handleChangePassword}
            disabled={savingPass}
          >
            {savingPass ? "Changing..." : "Change Password"}
          </button>
        </div>

        {passMsg && (
          <p
            className={`pass-msg ${passMsg.includes("success") ? "success" : "error"}`}
          >
            {passMsg}
          </p>
        )}

        <div className="pass-grid">
          <div className="info-field full">
            <label>Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
            />
          </div>
          <div className="info-field">
            <label>New Password</label>
            <input
              type="password"
              value={passwords.newPass}
              onChange={(e) =>
                setPasswords({ ...passwords, newPass: e.target.value })
              }
            />
          </div>
          <div className="info-field">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="settings-card">
        <h3 className="card-title">Settings</h3>
        <div className="notif-section">
          <p className="notif-label">
            <i className="fas fa-bell"></i> Notification Preferences
          </p>
          {[
            { key: "systemErrors", label: "Receive alerts for system errors" },
            {
              key: "securityIncidents",
              label: "Receive alerts for security incidents",
            },
            { key: "appointmentReminders", label: "Appointment Reminders" },
          ].map(({ key, label }) => (
            <div className="notif-item" key={key}>
              <span>{label}</span>
              <div
                className={`toggle ${notifications[key] ? "on" : ""}`}
                onClick={() => toggleNotif(key)}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
