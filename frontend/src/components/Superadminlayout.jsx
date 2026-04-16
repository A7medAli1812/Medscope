import React, { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./SuperAdminLayout.css";

const pageInfo = {
  "/super-admin/hospitals": { title: "Hospital Management", subtitle: "Manage and monitor all hospitals" },
  "/super-admin/admins":    { title: "Admin Management", subtitle: "Manage your personal information and settings" },
  "/super-admin/reports":   { title: "Reports & Analytics", subtitle: "Manage your personal information and settings" },
  "/super-admin/settings":  { title: "Settings", subtitle: "Manage your personal information and settings" },
};

const initialNotifications = [
  { id: 1, icon: "fas fa-hospital", message: "New hospital added: Al Salam Hospital", time: "2 min ago", read: false },
  { id: 2, icon: "fas fa-user", message: "New admin created: Sara Al-Mutairi", time: "15 min ago", read: false },
  { id: 3, icon: "fas fa-exclamation-triangle", message: "Hospital H004 has been suspended", time: "1 hour ago", read: false },
  { id: 4, icon: "fas fa-sync-alt", message: "Admin password reset: EMP1003", time: "3 hours ago", read: true },
  { id: 5, icon: "fas fa-check-circle", message: "System backup completed successfully", time: "1 day ago", read: true },
];

const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const notifRef = useRef(null);

  const current = pageInfo[location.pathname] || { title: "", subtitle: "" };
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { label: "Hospitals", icon: "fas fa-home",     path: "/super-admin/hospitals" },
    { label: "Admins",    icon: "fas fa-user",     path: "/super-admin/admins" },
    { label: "Reports",   icon: "fas fa-file-alt", path: "/super-admin/reports" },
    { label: "Settings",  icon: "fas fa-cog",      path: "/super-admin/settings" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="super-admin-wrapper">

      {/* Sidebar */}
      <aside className="super-sidebar">
        <div className="super-sidebar-header">
          <h2>Super Admin</h2>
        </div>

        <nav className="super-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `super-nav-item ${isActive ? "active" : ""}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="super-sidebar-footer">
          <button className="logout-btn" onClick={() => navigate("/")}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Right Side */}
      <div className="super-right">

        {/* Header */}
        <header className="super-header">
          <div className="super-header-left">
            <h2 className="super-header-title">{current.title}</h2>
            <p className="super-header-subtitle">{current.subtitle}</p>
          </div>
          <div className="super-header-right">

            {/* Notification Bell */}
            <div className="notif-wrapper" ref={notifRef}>
              <div className="notif-bell" onClick={() => setShowNotif((prev) => !prev)}>
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && <span className="notif-dot">{unreadCount}</span>}
              </div>

              {showNotif && (
                <div className="notif-dropdown">
                  <div className="notif-dropdown-header">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <button className="mark-all-btn" onClick={markAllRead}>Mark all as read</button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notif-item ${!n.read ? "unread" : ""}`}
                        onClick={() => markRead(n.id)}
                      >
                        <div className="notif-item-icon">
                          <i className={n.icon}></i>
                        </div>
                        <div className="notif-item-content">
                          <p className="notif-item-msg">{n.message}</p>
                          <span className="notif-item-time">{n.time}</span>
                        </div>
                        {!n.read && <span className="unread-dot"></span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="super-user-info">
              <img src="/public/sup.jpg" alt="admin" className="super-avatar" />
              <div>
                <p className="super-user-name">Ahmed</p>
                <p className="super-user-role">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="super-main">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SuperAdminLayout;