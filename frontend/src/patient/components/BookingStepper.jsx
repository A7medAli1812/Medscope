import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import '../styles/BookingStepper.css';

const BookingStepper = ({ currentStep }) => {
    const steps = [
        { id: 1, label: 'Specialty' },
        { id: 2, label: 'Doctor' },
        { id: 3, label: 'Date & Time' },
        { id: 4, label: 'Review' }
    ];

    return (
        <div className="booking-stepper-container">
            {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                    <React.Fragment key={step.id}>
                        <div className={`stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                            <div className="step-indicator">
                                <div className="step-number">
                                    {isCompleted ? <CheckIcon style={{ width: '16px', color: 'white' }} /> : step.id}
                                </div>
                                <span className="step-label">{step.label}</span>
                            </div>
                        </div>

                        {/* Add connector between steps (but not after the last step) */}
                        {index < steps.length - 1 && (
                            <div className="step-connector"></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default BookingStepper;
