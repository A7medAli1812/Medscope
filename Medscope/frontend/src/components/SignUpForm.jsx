
import React, { useState } from "react";
import "./SignUpForm.css";
import SuccessModal from "./SuccessModal";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import { ar } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import DatePicker from "react-datepicker";

const SignUpForm = () => {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(null);

  //  detect current language
  const currentLang = i18n.language;
  const currentLocale = currentLang === "ar" ? ar : enUS;
  const isRTL = currentLang === "ar";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength("");
      return;
    }

    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength < 2) setPasswordStrength("weak");
    else if (strength < 3) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  };

  const validateForm = () => {
    const newErrors = {};

    //  First Name
    if (!formData.firstName.trim()) newErrors.firstName = t("signup.fnamevalidation");

    //  Last Name
    if (!formData.lastName.trim()) newErrors.lastName = t("signup.lnamevalidation");

    //  Email
    if (!formData.email.trim()) newErrors.email = t("signup.emailvalidation");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t("signup.emailformatvalidation");

    //  Password
    if (!formData.password) newErrors.password = t("signup.passwordvalidation");
    else if (formData.password.length < 6) newErrors.password = t("signup.psw1validation");
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = t("signup.psw2validation");
    else if (!/\d/.test(formData.password)) newErrors.password = t("signup.psw3validation");

    //  Confirm Password
    if (!formData.confirmPassword) newErrors.confirmPassword = t("signup.confirmPasswordvalidation");
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = t("signup.confirmPasswordMatchvalidation");

    //  Phone
    if (!formData.phone.trim()) newErrors.phone = t("signup.phonevalidation");
    else if (!/^\+20\d{10}$/.test(formData.phone)) newErrors.phone = t("signup.phoneformatvalidation");

    //  Gender
    if (!formData.gender) newErrors.gender = t("signup.gendervalidation");

    //  Date of Birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t("signup.dobvalidation");
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();

      if (isNaN(birthDate.getTime())) {
        newErrors.dateOfBirth = t("signup.dobvalidation");
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        if (age < 13) newErrors.dateOfBirth = t("signup.dobagevalidation");
        else if (age > 120) newErrors.dateOfBirth = t("signup.dobfuturevalidation");
      }
    }

    //  Terms
    if (!formData.agreeToTerms) newErrors.agreeToTerms = t("signup.agreevalidation");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(" handleSubmit called");
    const isValid = validateForm();
    console.log(" Validation Result:", isValid);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      gender: "",
      dateOfBirth: "",
      agreeToTerms: false,
    });
    setSelectedDate(null);
    setErrors({});
    setPasswordStrength("");
  };

  return (
    <div className="signup-form-container">
      <div className="signup-form-card">
        <div className="form-header">
          <h1 className="form-title">{t("signup.title")}</h1>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* first + last name */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-labell">
                {t("signup.firstName")}
              </label>
              <div className="input-container">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder={t("signup.firstName")}
                  className={`form-inputt ${errors.firstName ? "error" : ""}`}
                />
              </div>
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-labell">
                {t("signup.lastName")}
              </label>
              <div className="input-container">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder={t("signup.lastName")}
                  className={`form-inputt ${errors.lastName ? "error" : ""}`}
                />
              </div>
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          {/* email */}
          <div className="form-group">
            <label htmlFor="email" className="form-labell">
              {t("signup.email")}
            </label>
            <div className="input-container">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("signup.email")}
                className={`form-inputt ${errors.email ? "error" : ""}`}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* password */}
          <div className="form-group">
            <label htmlFor="password" className="form-labell">
              {t("signup.password")}
            </label>
            <div className="input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t("signup.password")}
                className={`form-inputt ${errors.password ? "error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle-icon`}></i>
              </button>
            </div>
            {passwordStrength && (
              <div className={`password-strength ${passwordStrength}`}>
                <span>
                  {passwordStrength === "weak"
                    ? t("signup.strength1")
                    : passwordStrength === "medium"
                    ? t("signup.strength2")
                    : t("signup.strength3")}
                </span>
              </div>
            )}
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* confirm password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-labell">
              {t("signup.confirmPassword")}
            </label>
            <div className="input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder={t("signup.confirmPassword")}
                className={`form-inputt ${errors.confirmPassword ? "error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                <i
                  className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} password-toggle-icon`}
                ></i>
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* phone */}
          <div className="form-group">
            <label htmlFor="phone" className="form-labell">
              {t("signup.phone")}
            </label>
            <div className="input-container">
              <i className="fas fa-phone input-icon"></i>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+20xxxxxxxxxxx"
                className={`form-inputt ${errors.phone ? "error" : ""}`}
                maxLength={13}
              />
            </div>
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {/* gender */}
          <div className="form-group">
            <label className="form-labell">{t("signup.gender")}</label>
            <div className="radio-group">
              {["male", "female", "preferNotToSay"].map((g) => (
                <label className="radio-label" key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleInputChange}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  {t(`signup.${g}`)}
                </label>
              ))}
            </div>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>

          {/* date of birth */}
          <div className="form-group">
            <label className="form-labell">{t("signup.dob")}</label>
            <div className="input-container">
              <i className="fa-solid fa-calendar input-icon calendar-click"></i>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setFormData((prev) => ({ ...prev, dateOfBirth: date }));
                }}
                placeholderText={t("signup.selectDob")}
                locale={currentLocale}
                dateFormat="dd/MM/yyyy"
                className="form-inputt"
                calendarStartDay={isRTL ? 6 : 0}
                popperPlacement={isRTL ? "top-end" : "top-start"}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
            {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
          </div>

          {/* agree to terms */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                {t("signup.agreeText")}{" "}
                <a href="#terms" className="link">
                  {t("signup.terms")}
                </a>{" "}
                {t("signup.and")}{" "}
                <a href="#privacy" className="link">
                  {t("signup.privacy")}
                </a>
              </span>
            </label>
            {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
          </div>

          {/* submit */}
          <button type="submit" className="submit-button">
            <i className="fas fa-user-plus submit-icon"></i>
            <p className="crt-acc">{t("signup.submit")}</p>
          </button>

          <div className="Signin-link">
            {t("signup.alreadyAccount")} <Link to="/">{t("signup.signin")}</Link>
          </div>
        </form>
      </div>

      <SuccessModal isOpen={showSuccessModal} onClose={closeSuccessModal} />
    </div>
  );
};

export default SignUpForm;
