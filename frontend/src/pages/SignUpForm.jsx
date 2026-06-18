import React, { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import SuccessModal from "../components/SuccessModal";
import Loader from "../components/Loader";
import { signupUser } from "../patient/services/authService.js";
import "./Auth.css";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
const EGYPT_PHONE_RE = /^(\+20|01)[0-9]{9,10}$/;

const getPasswordStrength = (password) => {
  if (!password) return { level: "", label: "", width: "0%" };

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isLong = password.length >= 8;

  if (isLong && hasLower && hasUpper && hasNumber && hasSpecial)
    return { level: "strong", label: "Strong", width: "100%" };
  if (isLong && (hasLower || hasUpper) && hasNumber)
    return { level: "medium", label: "Medium", width: "66%" };
  return { level: "weak", label: "Weak", width: "33%" };
};

const validateField = (name, value, extra = {}) => {
  switch (name) {
    case "firstName":
    case "lastName":
      if (!value.trim()) return `${name === "firstName" ? "First" : "Last"} name is required.`;
      if (value.trim().length < 2) return `${name === "firstName" ? "First" : "Last"} name must be at least 2 characters.`;
      return "";
    case "email":
      if (!value.trim()) return "Email is required.";

      if (value.includes(" "))
        return "Email cannot contain spaces.";

      if (!EMAIL_RE.test(value))
        return "Please enter a valid email address (example: name@email.com).";

      if (value.length > 100)
        return "Email is too long.";

      return "";
    case "password":
      if (!value) return "Password is required.";
      if (value.length < 8) return "Password must be at least 8 characters.";
      if (!/[A-Z]/.test(value)) return "Password must include an uppercase letter.";
      if (!/[a-z]/.test(value)) return "Password must include a lowercase letter.";
      if (!/[0-9]/.test(value)) return "Password must include a number.";
      return "";
    case "confirmPassword":
      if (!value) return "Please confirm your password.";
      if (value !== extra.password) return "Passwords do not match.";
      return "";
    case "phone":
      if (!value.trim()) return "Phone number is required.";
      if (!EGYPT_PHONE_RE.test(value.replace(/\s/g, ""))) return "Enter a valid Egyptian phone (e.g. +201xxxxxxxxx).";
      return "";
    case "dob":
      if (!value) return "Date of birth is required.";

      const birthDate = new Date(value);
      const today = new Date();

      if (birthDate > today) return "Date of birth cannot be in the future.";

      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      const realAge =
        monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

      if (realAge < 18) return "You must be at least 18 years old.";

      return "";
    case "terms":
      if (!value) return "You must accept the Terms & Conditions.";
      return "";
    default:
      return "";
  }
};

const SignUpForm = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");
  const [dob, setDob] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const markTouched = useCallback((field) => setTouched((prev) => ({ ...prev, [field]: true })), []);

  const errors = useMemo(() => ({
    firstName: validateField("firstName", firstName),
    lastName: validateField("lastName", lastName),
    email: validateField("email", email),
    password: validateField("password", password),
    confirmPassword: validateField("confirmPassword", confirmPassword, { password }),
    phone: validateField("phone", phone),
    dob: validateField("dob", dob),
    terms: validateField("terms", termsAccepted),
  }), [firstName, lastName, email, password, confirmPassword, phone, dob, termsAccepted]);

  const shouldShow = (field) => (touched[field] || submitAttempted) && errors[field];
  const isFormValid = Object.values(errors).every((e) => !e) && strength.level !== "weak";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isFormValid) return;
    await handleConfirm();
  };

  const handleConfirm = async () => {
  try {
    setLoading(true);

    const data = await signupUser(
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      gender,
      dob
    );

    localStorage.setItem("token", data.token);
    setShowSuccess(true);

  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

  const fieldError = (field) => shouldShow(field) ? (
    <span className="field-error"><i className="fas fa-exclamation-circle"></i> {errors[field]}</span>
  ) : null;

  const inputGroupClass = (field) => `auth-input-group${shouldShow(field) ? " input-error" : ""}`;

  return (
    <>
      <AuthCard
        title="Sign Up"
        subtitle="Join our healthcare platform to manage your medical records and appointments"
        icon="fa-solid fa-user-doctor"
        isSignup={true}
      >
        <form onSubmit={handleSubmit} noValidate>
          {/* First & Last Name */}
          <div className="form-row">
            <div className="form-col">
              <label className="auth-label">First Name</label>
              <div className={inputGroupClass("firstName")}>
                <span className="auth-input-icon"><i className="fas fa-user"></i></span>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => markTouched("firstName")}
                />
              </div>
              {fieldError("firstName")}
            </div>
            <div className="form-col">
              <label className="auth-label">Last Name</label>
              <div className={inputGroupClass("lastName")}>
                <span className="auth-input-icon"><i className="fas fa-user"></i></span>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => markTouched("lastName")}
                />
              </div>
              {fieldError("lastName")}
            </div>
          </div>

          {/* Email */}
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <div className={inputGroupClass("email")}>
              <span className="auth-input-icon danger"><i className="fas fa-envelope"></i></span>
              <input
                type="email"
                className="auth-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
              />
            </div>
            {fieldError("email")}
          </div>

          {/* Password */}
          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <div className={inputGroupClass("password")}>
              <span className="auth-input-icon primary"><i className="fas fa-lock"></i></span>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched("password")}
              />
              <button type="button" className="auth-btn-icon" onClick={() => setShowPassword(!showPassword)}>
                <i className={`fas fa-eye${showPassword ? "-slash" : ""}`}></i>
              </button>
            </div>
            <div className="password-strength-wrapper">
              <div className="password-strength-bar">
                <div
                  className={`password-strength-fill ${strength.level}`}
                  style={{ width: strength.width }}
                ></div>
              </div>
              <span className={`password-strength-text ${strength.level}`}>
                {strength.label || "—"}
              </span>
            </div>
            <span className="password-hint">Must be at least 8 characters with one uppercase letter, one number, and one special character</span>
            {fieldError("password")}
          </div>

          {/* Confirm Password */}
          <div className="auth-form-group">
            <label className="auth-label">Confirm Password</label>
            <div className={inputGroupClass("confirmPassword")}>
              <span className="auth-input-icon primary"><i className="fas fa-lock"></i></span>
              <input
                type={showConfirm ? "text" : "password"}
                className="auth-input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => markTouched("confirmPassword")}
              />
              <button type="button" className="auth-btn-icon" onClick={() => setShowConfirm(!showConfirm)}>
                <i className={`fas fa-eye${showConfirm ? "-slash" : ""}`}></i>
              </button>
            </div>
            {fieldError("confirmPassword")}
          </div>

          {/* Phone */}
          <div className="auth-form-group">
            <label className="auth-label">Phone Number</label>
            <div className={inputGroupClass("phone")}>
              <span className="auth-input-icon danger"><i className="fas fa-phone"></i></span>
              <input
                type="tel"
                className="auth-input"
                placeholder="+20xxxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => markTouched("phone")}
              />
            </div>
            {fieldError("phone")}
          </div>

          {/* Gender */}
          <div className="auth-form-group">
            <label className="auth-label">Gender</label>
            <div className="gender-group">
              <label className="gender-radio">
                <input type="radio" name="gender" value="male" checked={gender === "male"} onChange={(e) => setGender(e.target.value)} /> Male
              </label>
              <label className="gender-radio">
                <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={(e) => setGender(e.target.value)} /> Female
              </label>
              <label className="gender-radio">
                <input type="radio" name="gender" value="preferNotToSay" checked={gender === "preferNotToSay"} onChange={(e) => setGender(e.target.value)} /> Prefer not to say
              </label>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="auth-form-group">
            <label className="auth-label">Date of Birth</label>
            <div className={inputGroupClass("dob")}>
              <input
                type="date"
                className="auth-input"
                value={dob}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDob(e.target.value)}
                onBlur={() => markTouched("dob")}
              />
            </div>
            {fieldError("dob")}
          </div>

          {/* Terms */}
          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                markTouched("terms");
              }}
            />
            <span className="terms-label">
              I agree to the <a href="#terms" className="auth-link">Terms & Conditions</a> and <a href="#privacy" className="auth-link">Privacy Policy</a> <span className="text-danger">*</span>
            </span>
          </label>
          {fieldError("terms")}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-user-plus"></i> Create Account</>}
          </button>

          <div className="text-center small-text text-muted mt-3">
            Already have an account? <Link to="/login" className="auth-link auth-link-danger ms-1" style={{ marginLeft: "0.5rem" }}>Sign In</Link>
          </div>
        </form>
      </AuthCard>
      {/* Loader */}
      {loading && <Loader message="Creating your account..." />}

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          message="Registration Successful!"
          onClose={() => {
            setShowSuccess(false);
            navigate("/login");
          }}
          autoDismiss={2500}
        />
      )}
    </>
  );
};

export default SignUpForm;