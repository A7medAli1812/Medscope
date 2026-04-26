import React, { useEffect, useState } from "react";
import "./MultiHospitalView.css";
import { getMultiHospitalBeds } from "../api/admin/hospitalService";

const MultiHospitalView = () => {

  const [hospitals,setHospitals] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");

  // fetch
  const fetchHospitals = async () => {
    try {
      setError("");

      const res = await getMultiHospitalBeds();
      setHospitals(res || []);

    } catch (err) {

      if (err.response?.status === 500) {
        setError("Server error, try again later");
      } else if (err.response?.status === 401) {
        setError("Unauthorized (login again)");
      } else {
        setError("Failed to load hospitals");
      }

    } finally {
      setLoading(false);
    }
  };

  // first load
  useEffect(()=>{
    fetchHospitals();
  },[]);

  // 🔥 auto refresh كل دقيقة
  useEffect(()=>{
    const interval = setInterval(()=>{
      console.log("🔄 refreshing hospitals...");
      fetchHospitals();
    },60000);

    return () => clearInterval(interval);
  },[]);

  // helpers
  const getPercent = (used,total)=>{
    if(!total) return 0;
    return Math.round((used / total) * 100);
  };

  const getColor = (percent)=>{
    if(percent < 50) return "#4CAF50";
    if(percent < 80) return "#FFC107";
    return "#E53935";
  };

  // UI states
  if(loading) return <div className="multi-page">Loading hospitals...</div>;
  if(error) return <div className="multi-page">{error}</div>;

  return (

    <div className="multi-page">

      <h2 className="page-title">Multi-Hospital View</h2>

      {hospitals.length === 0 && <p>No hospitals found</p>}

      {hospitals.map((hospital,index)=>{

        const usedBeds = hospital.usedBeds;
        const totalBeds = hospital.totalBeds;
        const availableBeds = hospital.availableBeds;

        return(

          <div className="hospital-card" key={index}>

            <div className="hospital-header">

              <div className="hospital-icon">
                <i className="fas fa-hospital"></i>
              </div>

              <div>
                <h3>{hospital.hospital}</h3>

                <p className="summary">
                  Total: {totalBeds} | Used: {usedBeds} | Available: {availableBeds}
                </p>
              </div>

            </div>

            <div className="beds-container">

              {hospital.beds?.map((bed,i)=>{

                const used = bed.totalBeds - bed.availableBeds;
                const total = bed.totalBeds;
                const percent = getPercent(used,total);

                return(

                  <div className="bed-row" key={i}>

                    <div className="bed-label">
                      <span>{bed.name}</span>

                      <span className="bed-count">
                        {used}/{total}
                      </span>
                    </div>

                    <div className="progress-bar">

                      <div
                        className="progress"
                        style={{
                          width:`${percent}%`,
                          background:getColor(percent)
                        }}
                      ></div>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        );

      })}

    </div>

  );

};

export default MultiHospitalView;