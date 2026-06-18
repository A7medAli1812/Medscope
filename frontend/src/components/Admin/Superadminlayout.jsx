import React, { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Superadminlayout.css";

const pageInfo = {
  "/super-admin/hospitals": { title: "Hospital Management", subtitle: "Manage your personal information and settings" },
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

  const [userName, setUserName] = useState("Gina");
  const [userRole, setUserRole] = useState("Super Admin");

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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.fullName) setUserName(parsed.fullName);
        if (parsed.role) {
          setUserRole(parsed.role === "SuperAdmin" ? "Super Admin" : parsed.role);
        }
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

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
          {/* Spacer to align with header */}
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
          <div className="super-header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn" 
              aria-label="Toggle Theme" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#004f78', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
            >
              <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            {/* User Info */}
            <div className="super-user-info">
              <div className="super-avatar initials-avatar">
                {(() => {
                  if (!userName) return "SA";
                  const parts = userName.trim().split(/\s+/);
                  if (parts.length > 1) {
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                  }
                  return userName.slice(0, 2).toUpperCase();
                })()}
              </div>
              <div>
                <p className="super-user-name">{userName}</p>
                <p className="super-user-role">{userRole}</p>
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