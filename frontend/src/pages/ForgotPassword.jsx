import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { useTranslation } from "react-i18next";
import { forgotPassword } from "../patient/services/authService";
import "./Auth.css";

const ForgotPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await forgotPassword(email);
            // Pass email to the OTP page via router state
            navigate("/otp-verification", { state: { email } });
        } catch (err) {
            let errorMessage = "Failed to send reset link. Please try again.";
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const firstKey = Object.keys(errors)[0];
                if (firstKey && errors[firstKey].length > 0) {
                    errorMessage = errors[firstKey][0];
                }
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (typeof err.response?.data === 'string' && err.response.data.trim() !== '') {
                errorMessage = err.response.data;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Forgot Password"
            subtitle="Please enter your Email to reset the password"
            icon="fa-solid fa-envelope"
        >
            <form onSubmit={handleSubmit}>
                <div className="auth-form-group mb-4">
                    <label className="auth-label">Email</label>
                    <div className="auth-input-group">
                        <span className="auth-input-icon danger">
                            <i className="fas fa-envelope"></i>
                        </span>
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Enter your email address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {error && <div className="auth-error-message mb-3" style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? "Sending..." : "Reset Password"}
                </button>

                <div className="text-center mt-4">
                    <Link to="/" className="auth-link small-text text-muted">
                        <i className="fas fa-arrow-left"></i> Back to Login
                    </Link>
                </div>
            </form>
        </AuthCard>
    );
};

export default ForgotPassword;
