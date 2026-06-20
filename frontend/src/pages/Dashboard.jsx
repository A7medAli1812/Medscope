import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { getDashboardStats, getPatientsChart } from "../api/admin/dashboardd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const COLORS = ["#2C5777", "#6C8EA4", "#D96C6C", "#A7BBC7", "#4F6D7A"];

const Dashboard = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [compareMonth, setCompareMonth] = useState(null);

  const [stats, setStats] = useState({
    totalBeds: 0,
    newPatients: 0,
    totalDoctors: 0,
    appointmentsCount: 0,
    doctorStats: []
  });

  const [chartData, setChartData] = useState([]);

  // 🔥 Fetch Dashboard
  const fetchDashboard = async () => {
    const res = await getDashboardStats(month, today.getDate());
    setStats(res.data);
  };

  // 🔥 Fetch ALL pages
  const fetchAllPatients = async (selectedMonth) => {
    let all = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await getPatientsChart(selectedMonth, page);
      const data = res.data.patientStats;

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        all = [...all, ...data];
        page++;
      }
    }

    return all;
  };

  // 🔥 Main Chart Logic
  const fetchChart = async () => {
    const current = await fetchAllPatients(month);

    let compare = [];
    if (compareMonth) {
      compare = await fetchAllPatients(compareMonth);
    }

    const merged = current.map((item, index) => ({
      date: new Date(item.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short"
      }),
      new: item.newPatients,
      old: item.oldPatients,
      compareNew: compare[index]?.newPatients || 0
    }));

    setChartData(merged);
  };

  useEffect(() => {
    fetchDashboard();
    fetchChart();
  }, [month, compareMonth]);

  // 🔥 Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#fff",
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        }}>
          <p><strong>{label}</strong></p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const doctorStats =
    stats?.doctorStats?.map((d) => ({
      name: d.doctorName,
      value: d.count
    })) || [];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Activity Overview</h2>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <h4>Total Beds</h4>
          <h2>{stats.totalBeds}</h2>
        </div>

        <div className="stat-card">
          <h4>New Patients</h4>
          <h2>{stats.newPatients}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Doctors</h4>
          <h2>{stats.totalDoctors}</h2>
        </div>

        <div className="stat-card">
          <h4>Appointments</h4>
          <h2>{stats.appointmentsCount}</h2>
        </div>
      </div>

      <div className="charts-container">

        {/* Pie */}
        <div className="chart-card">
          <h4>Appointments Distribution by Doctor</h4>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={doctorStats}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                animationDuration={800}
              >
                {doctorStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Patients Statistics</h4>

            <div style={{ display: "flex", gap: "10px" }}>
              {/* Month */}
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    Month {i + 1}
                  </option>
                ))}
              </select>

              {/* Compare */}
              <select
                value={compareMonth || ""}
                onChange={(e) =>
                  setCompareMonth(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Compare</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    Month {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <Bar
                dataKey="new"
                fill="#2C5777"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
              />

              <Bar
                dataKey="old"
                fill="#A7BBC7"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
              />

              {compareMonth && (
                <Bar
                  dataKey="compareNew"
                  fill="#D96C6C"
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;