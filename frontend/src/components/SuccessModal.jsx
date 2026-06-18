import React, { useEffect, useState } from "react";
import "./SuccessModal.css";

const SuccessModal = ({ message, onClose, autoDismiss = 4000 }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!message) return;

    setIsClosing(false);

    if (autoDismiss) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300); 
  };

  if (!message) return null;

  return (
    <div className={`success-overlay ${isClosing ? "fade-out" : "fade-in"}`} onClick={handleClose}>
      <div
        className={`success-modal ${isClosing ? "scale-out" : "scale-in"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green Check Icon */}
        <div className="success-icon-wrapper">
          <i className="fas fa-check"></i>
        </div>

        {/* Title */}
        <h3 className="success-title">Success</h3>

        {/* Message */}
        <p className="success-message">{message}</p>

        {/* OK Button */}
        <button className="success-btn" onClick={handleClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
