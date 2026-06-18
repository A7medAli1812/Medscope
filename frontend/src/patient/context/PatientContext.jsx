// src/patient/context/PatientContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import profileService from "../services/profileService";

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
    const [patient, setPatient] = useState({ name: "", loading: true });
    const [profileData, setProfileData] = useState(null);

    const initialBookingState = {
        hospitalId: null,
        hospitalName: null,
        specialtyId: null,
        specialtyName: null,
        doctorId: null,
        doctorName: null,
        doctorImage: null,
        date: null,
        time: null,
        notes: ''
    };
    const [bookingData, setBookingData] = useState(initialBookingState);

    const resetBookingData = () => setBookingData(initialBookingState);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                // profileService.getProfile() returns normalized data,
                // so data.firstName is always available (split from fullName)
                const data = await profileService.getProfile();
                setProfileData(data);
                setPatient({ name: data.firstName || "Patient", loading: false });
            } catch (err) {
                console.error("Failed to fetch patient profile:", err);
                setPatient({ name: "Patient", loading: false });
            }
        };
        fetchPatient();
    }, []);

    return (
        <PatientContext.Provider value={{
            patient, setPatient,
            profileData, setProfileData,
            bookingData, setBookingData,
            resetBookingData
        }}>
            {children}
        </PatientContext.Provider>
    );
};

export const usePatient = () => useContext(PatientContext);