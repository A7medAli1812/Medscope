import React, { useState } from "react";
import "./Dashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faUserInjured,
  faUserDoctor,
  faCalendarCheck
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {

  const [selectedMonth,setSelectedMonth] = useState("May");

  /* Doctors statistics */
  const doctorsData = [
    { name:"Dr. John", value:55 },
    { name:"Dr. Ahmed", value:25 },
    { name:"Dr. Hassan", value:8 },
    { name:"Dr. Ali", value:12 },
    { name:"Dr. Sara", value:18 },
    { name:"Dr. Adam", value:14 }
  ];

  /* Patients statistics */
  const patientsData = [
    { date:"25 May", new:20, old:10 },
    { date:"26 May", new:30, old:15 },
    { date:"27 May", new:40, old:20 },
    { date:"28 May", new:50, old:25 },
    { date:"29 May", new:45, old:18 },
    { date:"30 May", new:42, old:28 },
    { date:"31 May", new:35, old:22 }
  ];

  const COLORS = [
    "#2C5777",
    "#8FA9BE",
    "#C9D8E6",
    "#E16B6B",
    "#6C8EA4",
    "#9BB3C7"
  ];

  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">Activity Overview</h1>

      {/* STAT CARDS */}

      <div className="stats-cards">

        <div className="stat-card">
          <div className="stat-text">
            <h4>Total Beds</h4>
            <h2>120</h2>
          </div>
          <FontAwesomeIcon icon={faBed} className="stat-icon"/>
        </div>

        <div className="stat-card">
          <div className="stat-text">
            <h4>New Patients</h4>
            <h2>50</h2>
          </div>
          <FontAwesomeIcon icon={faUserInjured} className="stat-icon"/>
        </div>

        <div className="stat-card">
          <div className="stat-text">
            <h4>Total Doctors</h4>
            <h2>31</h2>
          </div>
          <FontAwesomeIcon icon={faUserDoctor} className="stat-icon"/>
        </div>

        <div className="stat-card">
          <div className="stat-text">
            <h4>Appointments</h4>
            <h2>100</h2>
          </div>
          <FontAwesomeIcon icon={faCalendarCheck} className="stat-icon"/>
        </div>

      </div>

      {/* CHARTS */}

      <div className="charts-container">

        {/* Doctors Pie */}

        <div className="chart-card">

          <div className="chart-header">
            <h3>Appointments Distribution by Doctor</h3>
          </div>

          <div className="pie-container">

            <ResponsiveContainer width="100%" height={260}>

              <PieChart>

                <Pie
                  data={doctorsData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >

                  {doctorsData.map((entry,index)=>(
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}

                </Pie>

                <Tooltip/>

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* doctors list */}

          <div className="doctor-list">

            {doctorsData.map((doc,index)=>(
              <div key={index} className="doctor-item">
                <span className="color-dot"
                style={{background:COLORS[index % COLORS.length]}}
                ></span>

                {doc.name}

                <span className="doctor-count">
                  {doc.value}
                </span>
              </div>
            ))}

          </div>

        </div>


        {/* Patients statistics */}

        <div className="chart-card">

          <div className="chart-header">

            <h3>Patients Statistics</h3>

            <select
            className="month-select"
            value={selectedMonth}
            onChange={(e)=>setSelectedMonth(e.target.value)}
            >
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
            </select>

          </div>

          <div className="total-patients">
            Total No of Patients : 480
          </div>

          <ResponsiveContainer width="100%" height={260}>

            <BarChart data={patientsData}>

              <CartesianGrid strokeDasharray="3 3"/>

              <XAxis dataKey="date"/>

              <YAxis/>

              <Tooltip/>

              <Legend/>

              <Bar dataKey="new" fill="#2C5777" name="New Patients"/>

              <Bar dataKey="old" fill="#9BB3C7" name="Old Patients"/>

            </BarChart>

          </ResponsiveContainer>

          {/* pagination */}

          <div className="pagination">

            <button>Previous</button>

            <div className="pages">
              <span className="active">1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>

            <button>Next</button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;