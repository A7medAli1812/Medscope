import { Routes, Route } from "react-router-dom";

import AdminLayout from "./AdminLayout";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import BedManagement from "./pages/BedManagement";
import BloodBank from "./pages/BloodBank";
import Home from "./pages/Home";
import MultiHospitalView from "./pages/MultiHospitalView";
import NewAppointment from "./pages/new-appointment";
import NewDoctor from "./pages/new-doctor";


export default function AdminRoutes() {
  return (
    <Routes>

      {/* كل صفحات الادمن جوه الـ Layout */}
      <Route element={<AdminLayout />}>

        {/* Default */}
        <Route index element={<Dashboard />} />


        {/* Main pages */}
        <Route 
          path="dashboard" 
          element={<Dashboard />} 
        />

        <Route 
          path="home" 
          element={<Home />} 
        />


        {/* Hospital management */}
        <Route 
          path="patients" 
          element={<Patients />} 
        />

        <Route 
          path="doctors" 
          element={<Doctors />} 
        />

        <Route 
          path="appointments" 
          element={<Appointments />} 
        />


        {/* Extra */}
        <Route 
          path="beds" 
          element={<BedManagement />} 
        />

        <Route 
          path="blood-bank" 
          element={<BloodBank />} 
        />

        <Route 
          path="multi-hospitals" 
          element={<MultiHospitalView />} 
        />


        {/* Forms */}
        <Route 
          path="new-appointment" 
          element={<NewAppointment />} 
        />

        <Route 
          path="new-doctor" 
          element={<NewDoctor />} 
        />

      </Route>

    </Routes>
  );
}