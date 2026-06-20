import React, { useEffect, useState } from "react";
import "./Home.css";
import { getDashboardSummary } from "../api/admin/dashboard";
import toast from "react-hot-toast";

const Home = () => {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getDashboardSummary();
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard");
    }
  };

  if (!data) return <div className="loading">Loading...</div>;

  return (
    <div className="home-page">

      <h2 className="page-title">Home</h2>

      {/* 🔥 الكارد الكبير */}
      <div className="home-card">

        {/* LEFT */}
        <div className="home-left">

          <h3 className="hospital-name">
            🏥 {data.hospitalName}
          </h3>

          <p className="hospital-type">
            {data.hospitalType}
          </p>

          <div className="info-list">

            <p>👨‍⚕️ {data.doctorsCount} Doctors</p>
            <p>🏢 {data.departmentsCount} Departments</p>
            <p>📞 {data.phone}</p>
            <p>📧 {data.email}</p>
            <p>🌐 {data.website}</p>

          </div>

        </div>

        {/* RIGHT */}
        <div className="home-right">

          <h4>Available Specialties</h4>

          <div className="specialties">

            <span>Cardiology</span>
            <span>Neurology</span>
            <span>Orthopedics</span>
            <span>Pediatrics</span>
            <span>Emergency</span>
            <span>Dermatology</span>
            <span>Radiology</span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;