import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClinicMedical } from "@fortawesome/free-solid-svg-icons";


const Sidebar = () => {

    const location = useLocation();
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


    const menuItems = [

        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: "fa-tachometer-alt"
        },

        {
            name: "Home",
            path: "/admin/home",
            icon: "fa-home"
        },

        {
            name: "Patients",
            path: "/admin/patients",
            icon: "fa-user-injured"
        },

        {
            name: "Appointments",
            path: "/admin/appointments",
            icon: "fa-calendar-check"
        },

        {
            name: "Doctors",
            path: "/admin/doctors",
            icon: "fa-user-md"
        },

        {
            name: "Bed Management",
            path: "/admin/beds",
            icon: "fa-bed"
        },

        {
            name: "Blood Bank",
            path: "/admin/blood-bank",
            icon: "fa-tint"
        },

        {
            name: "Multi Hospital View",
            path: "/admin/multi-hospitals",
            icon: "fa-hospital"
        },

    ];



    return (

        <aside className="sidebar">


            {/* Header */}

            <div className="sidebar-header">


                <div className="logo-icon">

                    <FontAwesomeIcon 
                        icon={faClinicMedical}
                    />

                </div>


                <h2>
                    Alhaya
                </h2>


            </div>





            {/* Menu */}

            <nav className="sidebar-nav">


                <ul>


                    {
                        menuItems.map((item)=> (


                            <li
                                key={item.path}
                                className={
                                    location.pathname === item.path
                                    ? "active"
                                    : ""
                                }
                            >


                                <Link to={item.path}>


                                    <i 
                                      className={
                                        `fas ${item.icon} nav-icon`
                                      }
                                    >

                                    </i>


                                    <span>
                                        {item.name}
                                    </span>


                                </Link>


                            </li>


                        ))
                    }


                </ul>


            </nav>





            {/* Logout */}

            <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px 15px' }}>
                <button 
                    onClick={toggleTheme} 
                    className="theme-toggle-btn"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', color: '#688c9f', padding: '12px 15px', width: '100%', fontFamily: 'inherit', fontSize: '14px', borderRadius: '8px', transition: 'background-color 0.2s' }}
                >
                    <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`} style={{ width: '20px', fontSize: '16px' }}></i>
                    <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                </button>

                <Link 
                    to="/"
                    className="logout-btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', borderRadius: '8px', width: '100%' }}
                >

                    <i className="fas fa-sign-out-alt nav-icon" style={{ width: '20px', fontSize: '16px' }}></i>

                    Logout


                </Link>


            </div>



        </aside>

    );
};


export default Sidebar;