import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const NotFound = () => {
    return (
        <div className="auth-page-wrapper">
            <div className="auth-card" style={{ textAlign: "center", maxWidth: "500px" }}>
                <div className="auth-card-body">
                    <div style={{ marginBottom: "1.5rem" }}>
                        <div
                            style={{
                                fontSize: "5rem",
                                fontWeight: 800,
                                color: "#084668",
                                lineHeight: 1,
                                letterSpacing: "-2px",
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            404
                        </div>
                        <div
                            style={{
                                width: "60px",
                                height: "4px",
                                background: "linear-gradient(90deg, #084668, #3ae8b6)",
                                borderRadius: "2px",
                                margin: "1rem auto",
                            }}
                        />
                    </div>

                    <h2 className="auth-title" style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
                        Page Not Found
                    </h2>
                    <p className="auth-subtitle" style={{ marginBottom: "2rem" }}>
                        Sorry, the page you're looking for doesn't exist or has been moved.
                    </p>

                    <Link to="/" className="auth-submit-btn" style={{ textDecoration: "none" }}>
                        <i className="fas fa-home"></i> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
