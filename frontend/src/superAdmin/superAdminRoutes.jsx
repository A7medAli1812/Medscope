import { Routes, Route } from "react-router-dom";

import AdminManagement from "./pages/Adminmanagement";
import HospitalManagement from "./pages/Hospitalmanagement";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import SuperAdminLayout from "../components/Admin/Superadminlayout";

export default function SuperAdminRoutes() {
  return (
    <Routes>
      <Route element={<SuperAdminLayout />}>
        <Route index element={<AdminManagement />} />

        <Route path="admins" element={<AdminManagement />} />

        <Route path="hospitals" element={<HospitalManagement />} />

        <Route path="reports" element={<Reports />} />

        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
