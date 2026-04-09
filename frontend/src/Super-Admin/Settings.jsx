import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState({
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
  });
  const [tempInfo, setTempInfo] = useState({ ...info });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [passMsg, setPassMsg] = useState("");

  const [notifications, setNotifications] = useState({
    systemErrors: true,
    securityIncidents: false,
    appointmentReminders: true,
  });

  const handleEdit = () => {
    setTempInfo({ ...info });
    setIsEditing(true);
  };

  const handleSaveInfo = () => {
    setInfo({ ...tempInfo });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!passwords.current) return setPassMsg("Please enter current password.");
    if (passwords.newPass.length < 6) return setPassMsg("New password must be at least 6 characters.");
    if (passwords.newPass !== passwords.confirm) return setPassMsg("Passwords don't match.");
    setPassMsg("Password changed successfully!");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  const toggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-subtitle">Manage your personal information and settings</p>
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
            <label><i className="fas fa-user"></i> Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={tempInfo.fullName}
                onChange={(e) => setTempInfo({ ...tempInfo, fullName: e.target.value })}
              />
            ) : (
              <p>{info.fullName}</p>
            )}
          </div>

          <div className="info-field">
            <label><i className="fas fa-envelope"></i> Email</label>
            <p className="readonly">{info.email}</p>
          </div>

          <div className="info-field">
            <label><i className="fas fa-phone"></i> Phone Number</label>
            {isEditing ? (
              <input
                type="text"
                value={tempInfo.phone}
                onChange={(e) => setTempInfo({ ...tempInfo, phone: e.target.value })}
              />
            ) : (
              <p>{info.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="settings-card">
        <div className="card-top">
          <h3 className="card-title">Security Settings</h3>
          <button className="edit-btn" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>

        {passMsg && (
          <p className={`pass-msg ${passMsg.includes("success") ? "success" : "error"}`}>{passMsg}</p>
        )}

        <div className="pass-grid">
          <div className="info-field full">
            <label>Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>
          <div className="info-field">
            <label>New Password</label>
            <input
              type="password"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
            />
          </div>
          <div className="info-field">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="settings-card">
        <h3 className="card-title">Settings</h3>
        <div className="notif-section">
          <p className="notif-label"><i className="fas fa-bell"></i> Notification Preferences</p>
          {[
            { key: "systemErrors", label: "Receive alerts for system errors" },
            { key: "securityIncidents", label: "Receive alerts for security incidents" },
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