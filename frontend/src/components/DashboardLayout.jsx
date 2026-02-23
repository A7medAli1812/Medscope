import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '2rem', marginLeft: '250px' }} className="dashboard-content">
                <Outlet />
            </div>
            {/* RTL Adjustment helper */}
            <style>{`
        html[dir="rtl"] .dashboard-content {
          margin-left: 0 !important;
          margin-right: 250px !important;
        }
      `}</style>
        </div>
    );
};

export default DashboardLayout;
