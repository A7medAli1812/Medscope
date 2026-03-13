import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./SuperAdminLayout.css";

const SuperAdminLayout = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Hospitals", icon: "fas fa-home", path: "/super-admin/hospitals" },
    { label: "Admins", icon: "fas fa-user", path: "/super-admin/admins" },
    { label: "Reports", icon: "fas fa-file-alt", path: "/super-admin/reports" },
    { label: "Settings", icon: "fas fa-cog", path: "/super-admin/settings" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="super-admin-wrapper">
      {/* Sidebar */}
      <aside className="super-sidebar">
        <div className="super-sidebar-header">
          <h2>Patient Portal</h2>
        </div>

        <nav className="super-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `super-nav-item ${isActive ? "active" : ""}`
              }
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="super-sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="super-main">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;