import React, { useEffect, useState } from "react";
import {
  BellAlertIcon,
  CalendarIcon,
  DocumentTextIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  DocumentIcon
} from "@heroicons/react/24/outline";

import { NavLink } from "react-router-dom";
import "../styles/Dashboard.css";

import { getDashboardData } from "../services/dashboardService";
import Loader from "../../components/Loader";

const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboard = async () => {
      try {

        const data = await getDashboardData();
        setDashboardData(data);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

  }, []);

  if (loading) {
    return <Loader message="Loading Your Dashboard..." />
  }

  return (
<>

      <div className="dashboard-container">

      {/* Updates */}
      <div className="updates-card">

        <div className="updates-header">
          <BellAlertIcon />
          <h3>
            New Updates
            <span className="updates-count">
              ({dashboardData.updates.length})
            </span>
          </h3>
        </div>

        <div className="updates-list">

          {dashboardData.updates.length === 0 ? (
            <p className="no-data">No updates available</p>
          ) : (
            dashboardData.updates.map((update, index) => (
              <div key={index} className="update-item">
                <p className="update-title">{update.title}</p>
                <p className="update-time">{update.time}</p>
              </div>
            ))
          )}

        </div>

      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">

        <NavLink
          to="/patient/appointments/upcoming"
          className="action-card action-appointments"
        >
          <div className="action-icon-wrapper">
            <CalendarIcon />
          </div>

          <div className="action-text">
            <h4>Appointments</h4>
            <p>{dashboardData.upcomingAppointmentsCount} Upcoming</p>
          </div>
        </NavLink>

        <NavLink
          to="/patient/medical-history"
          className="action-card action-reports"
        >
          <div className="action-icon-wrapper">
            <DocumentTextIcon />
          </div>

          <div className="action-text">
            <h4>Medical Reports</h4>
            <p>{dashboardData.medicalRecordsCount} Reports</p>
          </div>
        </NavLink>

        <NavLink
          to="/patient/appointments/hospital"
          className="action-card action-book"
        >
          <div className="action-icon-wrapper">
            <PlusIcon />
          </div>

          <div className="action-text">
            <h4>Book Appointment</h4>
            <p>Schedule Visit</p>
          </div>
        </NavLink>

        <NavLink
          to="/patient/assistant"
          className="action-card action-assistant"
        >
          <div className="action-icon-wrapper">
            <ChatBubbleLeftRightIcon />
          </div>

          <div className="action-text">
            <h4>Smart Assistant</h4>
            <p>Ask Questions</p>
          </div>
        </NavLink>

      </div>

      {/* Bottom Section */}
      <div className="bottom-sections-grid">

        {/* Appointments */}
        <div className="section-card">

          <div className="section-header">
            <h3>Upcoming Appointments</h3>

            <NavLink
              to="/patient/appointments/upcoming"
              className="section-link"
            >
              View All
            </NavLink>
          </div>

          <div className="list-container">

            {dashboardData.upcomingAppointments.length === 0 ? (
              <p className="no-data">No upcoming appointments</p>
            ) : (

              dashboardData.upcomingAppointments.map((appointment, index) => (

                <div key={index} className="list-item">

                  <div className="item-info-row">

                    <div className="item-details">

                      <h4>{appointment.doctorName}</h4>

                      <p className="item-subtitle">
                        {appointment.specialization}
                      </p>

                      <p className="item-date">
                        <CalendarIcon />
                        {appointment.date}
                      </p>

                    </div>

                  </div>

                  <span className="badge-confirmed">
                    {appointment.status}
                  </span>

                </div>

              ))

            )}

          </div>

        </div>

        {/* Reports */}
        <div className="section-card">

          <div className="section-header">
            <h3>Medical Reports</h3>

            <NavLink
              to="/patient/medical-history"
              className="section-link"
            >
              View All
            </NavLink>
          </div>

          <div className="list-container">

            {dashboardData.medicalRecords.length === 0 ? (
              <p className="no-data">No medical reports</p>
            ) : (

              dashboardData.medicalRecords.map((report, index) => (

                <div key={index} className="list-item">

                  <div className="item-info-row">

                    <DocumentIcon className="item-icon" />

                    <div className="item-details">

                      <h4>{report.title}</h4>

                      <p className="item-date">
                        {report.date}
                      </p>

                    </div>

                  </div>

                  <span className="badge-ready">
                    Ready
                  </span>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
    </>
  );
};

export default Dashboard;