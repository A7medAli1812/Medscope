import { useContext } from 'react';
import { PatientContext } from '../context/PatientContext';

export const usePatientData = () => {
    const context = useContext(PatientContext);
    if (context === undefined) {
        throw new Error('usePatientData must be used within a PatientProvider');
    }
    return context;
};
