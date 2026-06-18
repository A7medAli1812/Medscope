import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DoctorWorkingHours.css";

import {
  getDoctorWorkingHours,
  updateDoctorWorkingHours,
} from "../services/DoctorWorkingHours";

const dayOrder = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DURATION_OPTIONS = [15, 30, 45, 60];

const defaultSchedule = () =>
  Object.fromEntries(
    dayOrder.map((day) => [
      day,
      {
        enabled: false,
        startTime: "09:00",
        endTime: "16:00",
      },
    ])
  );

const formatTime = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${String(hour).padStart(2, "0")}:${minute} ${ampm}`;
};

const DoctorWorkingHours = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(defaultSchedule());
  const [appointmentDuration, setAppointmentDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingDay, setEditingDay] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await getDoctorWorkingHours();

        if (data) {
          // Backend returns { appointmentDuration, workingDays: [{day, from, to}] }
          const workingDaysArray = Array.isArray(data.workingDays)
            ? data.workingDays
            : Array.isArray(data)
            ? data
            : [];

          const normalized = Object.fromEntries(
            dayOrder.map((day) => {
              const entry = workingDaysArray.find(
                (item) =>
                  (item.day || item.name || "").toLowerCase() === day.toLowerCase()
              );
              return [
                day,
                {
                  enabled: !!entry,
                  startTime: entry?.from || entry?.startTime || "09:00",
                  endTime: entry?.to || entry?.endTime || "16:00",
                },
              ];
            })
          );
          setSchedule(normalized);

          const duration = data.appointmentDuration || data[0]?.appointmentDuration;
          if (duration) setAppointmentDuration(duration);
        }
      } catch (error) {
        console.error("Error fetching working hours:", error);
        setMessage("Failed to load working hours. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const handleToggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
    setEditingDay(null);
    setEditingField(null);
  };

  const handleTimeClick = (day, field) => {
    if (!schedule[day].enabled) return;
    setEditingDay(day);
    setEditingField(field);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const scheduleArray = dayOrder.map((day) => ({
        day,
        enabled: schedule[day].enabled,
        startTime: schedule[day].startTime,
        endTime: schedule[day].endTime,
      }));

      await updateDoctorWorkingHours(scheduleArray, appointmentDuration);
      setMessage("Working hours updated successfully.");
    } catch (error) {
      console.error("Error saving working hours:", error);
      setMessage("Failed to update working hours.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="dwh-loading">Loading...</div>;
  }

  return (
    <div className="dwh-page">
      <div className="dwh-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="dwh-back-btn" onClick={() => navigate(-1)}>
          <span className="dwh-back-icon">&#8592;</span>
          <span>Appointments</span>
        </button>
        <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn" 
            aria-label="Toggle Theme" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'inherit', padding: '8px' }}
        >
            <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
        </button>
      </div>

      <div className="dwh-header">
        <h1 className="dwh-page-title">Working hours settings</h1>
        <p className="dwh-subtitle">
          Specify your working days and hours and the duration of each appointment.
        </p>
      </div>

      <div className="dwh-content">
        {message && <div className="dwh-message">{message}</div>}

        {/* Duration selector */}
        <div className="dwh-duration-card">
          <p className="dwh-duration-label">Duration of each appointment</p>
          <div className="dwh-duration-options">
            {DURATION_OPTIONS.map((mins) => (
              <button
                key={mins}
                className={`dwh-duration-btn${appointmentDuration === mins ? " active" : ""}`}
                onClick={() => setAppointmentDuration(mins)}
              >
                {mins} minutes
              </button>
            ))}
          </div>
        </div>

        {/* Day rows */}
        {dayOrder.map((day) => {
          const item = schedule[day];
          const isEditingStart = editingDay === day && editingField === "startTime";
          const isEditingEnd = editingDay === day && editingField === "endTime";

          return (
            <div className="dwh-day-card" key={day}>
              <div className="dwh-checkbox-wrap">
                <input
                  type="checkbox"
                  className="dwh-checkbox"
                  checked={item.enabled}
                  onChange={() => handleToggleDay(day)}
                  id={`toggle-${day}`}
                />
              </div>

              <label className="dwh-day-name" htmlFor={`toggle-${day}`}>
                {day}
              </label>

              <div className="dwh-time-controls">
                <span className="dwh-time-label">From</span>
                {isEditingStart ? (
                  <input
                    type="time"
                    className="dwh-time-input"
                    value={item.startTime}
                    autoFocus
                    onChange={(e) => handleTimeChange(day, "startTime", e.target.value)}
                    onBlur={() => { setEditingDay(null); setEditingField(null); }}
                  />
                ) : (
                  <button
                    className="dwh-time-btn"
                    disabled={!item.enabled}
                    onClick={() => handleTimeClick(day, "startTime")}
                  >
                    {formatTime(item.startTime)}
                  </button>
                )}

                <span className="dwh-time-label">To</span>
                {isEditingEnd ? (
                  <input
                    type="time"
                    className="dwh-time-input"
                    value={item.endTime}
                    autoFocus
                    onChange={(e) => handleTimeChange(day, "endTime", e.target.value)}
                    onBlur={() => { setEditingDay(null); setEditingField(null); }}
                  />
                ) : (
                  <button
                    className="dwh-time-btn"
                    disabled={!item.enabled}
                    onClick={() => handleTimeClick(day, "endTime")}
                  >
                    {formatTime(item.endTime)}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div className="dwh-save-wrap">
          <button className="dwh-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorWorkingHours;