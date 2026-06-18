import { Routes, Route, Navigate } from "react-router-dom";

import AppointmentDetails from "./pages/AppointmentDetails";
import DoctorAppointment from "./pages/DoctorAppointments";
import DoctorWorkingHours from "./pages/DoctorWorkingHours";
import EditPatient from "./pages/EditPatient";
import PatientRecord from "./pages/PatientRecord";
import Patients from "./pages/Patients";
import StartVisit from "./pages/StartVisit";

export default function DoctorRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="appointments" replace />} />

      <Route path="appointments" element={<DoctorAppointment />} />

      <Route path="appointment-details" element={<AppointmentDetails />} />
      <Route path="appointment-details/:id" element={<AppointmentDetails />} />

      <Route path="patients" element={<Patients />} />

      <Route path="patient-record" element={<PatientRecord />} />
      <Route path="patient-record/:id" element={<PatientRecord />} />

      <Route path="working-hours" element={<DoctorWorkingHours />} />

      <Route path="edit-patient" element={<EditPatient />} />
      <Route path="edit-patient/:id" element={<EditPatient />} />

      <Route path="start-visit" element={<StartVisit />} />
      <Route path="start-visit/:id" element={<StartVisit />} />
    </Routes>
  );
}