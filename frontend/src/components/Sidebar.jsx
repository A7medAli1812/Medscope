import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClinicMedical } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: "Home", path: "/home", icon: "fa-home" },
        { name: "Patients", path: "/patients", icon: "fa-user-injured" },
        { name: "Appointments", path: "/appointments", icon: "fa-calendar-check" },
        { name: "Doctors", path: "/doctors", icon: "fa-user-md" },
        { name: "Bed Management", path: "/bed-management", icon: "fa-bed"},
        { name: "Blood Bank", path: "/blood-bank", icon: "fa-tint"},
        { name: "Multi-Hospital-view", path: "/multi-hospital-view", icon: "fa-hospital"},
        { name: "Dashboard", path: "/dashboard", icon: "fa-tachometer-alt" },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">

                <FontAwesomeIcon icon={faClinicMedical}/>
                </div>
                <h2>Alhaya</h2>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path} className={location.pathname === item.path ? "active" : ""}>
                            <Link to={item.path}>
                                <i className={`fas ${item.icon} nav-icon`}></i>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <Link to="/" className="logout-btn">
                    <i className="fas fa-sign-out-alt nav-icon"></i>
                    Logout
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
