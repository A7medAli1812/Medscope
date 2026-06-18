import React from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import "./Auth.css";

const ResetSuccess = () => {
    return (
        <AuthCard
            title="Successful"
            subtitle="Congratulations! Your password has been successfully updated. Click Continue to login"
            icon="fa-solid fa-check text-success"
        >
            <div className="text-center mt-2">
                <Link to="/" className="auth-submit-btn" style={{ textDecoration: 'none' }}>
                    Continue
                </Link>
            </div>
        </AuthCard>
    );
};

export default ResetSuccess;
