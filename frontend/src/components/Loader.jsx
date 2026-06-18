import React from "react";
import "./Loader.css";

const Loader = ({ message = "Loading..." }) => {
    return (
        <div className="loader-overlay">
            <div className="loader-content">
                {/* Animated pulse ring */}
                <div className="loader-rings">
                    <div className="loader-ring ring-1"></div>
                    <div className="loader-ring ring-2"></div>
                    <div className="loader-ring ring-3"></div>
                    <div className="loader-center-icon">
                        <i className="fas fa-heartbeat"></i>
                    </div>
                </div>
                <p className="loader-text">{message}</p>
            </div>
        </div>
    );
};

export default Loader;
