import React from 'react';
import './SuccessModal.css';
import { useTranslation } from 'react-i18next';

const SuccessModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2 className="modal-title">{t("SuccessModal.title")}</h2>
        <p className="modal-message">{t("SuccessModal.message")}</p>
        <button className="modal-ok-btn" onClick={onClose}>
          <i className="fas fa-check modal-btn-icon"></i>
          {t("SuccessModal.loginButton")}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
