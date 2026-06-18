import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { getDashboardStats, getPatientsChart } from "../services/dashboardd";
import { getDoctors } from "../services/doctors";
import { getNewAppointments, getCompletedAppointments } from "../services/appointments";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faUsers, faUserMd, faCalendarCheck, faBell } from "@fortawesome/free-solid-svg-icons";

const COLORS = ["#1a4968", "#5e81ac", "#c05f5f", "#a3be8c", "#b48ead", "#ebcb8b"];

// Helper function to normalize doctor names to prevent prefix-based mismatches (e.g. "Dr. Islam Ali" vs "Islam Ali")
const normalizeDoctorName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/^(dr\.|dr|doctor|د\.|د|دكتور)\s+/g, "") // Strip prefixes in English and Arabic
    .replace(/\s+/g, " ")                           // Normalize multiple spaces
    .trim();
};

const Dashboard = () => {
  const today = new Date();

  // Retrieve user details from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || "Jonitha";
  const userRole = user.role || "Admin";

  // Dashboard filter states (for stats & doctor distribution)
  const [dashboardMonth, setDashboardMonth] = useState(today.getMonth() + 1);
  const [dashboardDay, setDashboardDay] = useState(0); // Default to 0 (Whole Month / All Days)

  // Patients chart filter states
  const [chartMonth, setChartMonth] = useState(today.getMonth() + 1);
  const [chartPage, setChartPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);

  // List of all registered doctors in the hospital
  const [allDoctors, setAllDoctors] = useState([]);

  const [stats, setStats] = useState({
    totalBeds: 0,
    newPatients: 0,
    totalDoctors: 0,
    appointmentsCount: 0,
    doctorStats: []
  });

  const [chartData, setChartData] = useState([]);

  // Fetch registered doctors
  const fetchAllDoctors = async () => {
    try {
      const res = await getDoctors({ page: 1, pageSize: 100 });
      if (res && res.data) {
        setAllDoctors(res.data);
      }
    } catch (err) {
      console.error("Error fetching hospital doctors:", err);
    }
  };

  // Fetch all appointments from new and completed endpoints, and calculate stats dynamically
  const fetchAppointmentsStats = async (month, day) => {
    try {
      const [newRes, completedRes] = await Promise.all([
        getNewAppointments(),
        getCompletedAppointments()
      ]);

      const newAppts = newRes.data?.data || newRes.data || [];
      const completedAppts = completedRes.data?.data || completedRes.data || [];
      const allAppts = [...newAppts, ...completedAppts];

      // Filter by selected month and day (if day !== 0)
      const filteredAppts = allAppts.filter((a) => {
        if (!a.date) return false;
        const parts = a.date.split("-"); // Date is YYYY-MM-DD
        if (parts.length < 3) return false;
        const apptMonth = Number(parts[1]);
        const apptDay = Number(parts[2]);

        const monthMatch = apptMonth === month;
        const dayMatch = day === 0 || apptDay === day;

        return monthMatch && dayMatch;
      });

      // Group and count appointments per doctor
      const counts = {};
      filteredAppts.forEach((a) => {
        if (a.doctorName) {
          const name = a.doctorName.trim();
          counts[name] = (counts[name] || 0) + 1;
        }
      });

      const doctorStats = Object.keys(counts).map((name) => ({
        doctorName: name,
        count: counts[name]
      }));

      return {
        appointmentsCount: filteredAppts.length,
        doctorStats
      };
    } catch (err) {
      console.error("Error calculating appointments stats:", err);
      return {
        appointmentsCount: 0,
        doctorStats: []
      };
    }
  };

  // Fetch Dashboard Statistics
  const fetchDashboard = async () => {
    try {
      // Fetch stats from getDashboardStats API (provides beds, new patients, total doctors)
      const res = await getDashboardStats(
        dashboardMonth,
        dashboardDay !== 0 ? dashboardDay : undefined
      );

      // Fetch actual appointments from getNewAppointments / getCompletedAppointments and count dynamically
      const apptStats = await fetchAppointmentsStats(dashboardMonth, dashboardDay);

      if (res.data) {
        setStats({
          totalBeds: res.data.totalBeds || 0,
          newPatients: res.data.newPatients || 0,
          totalDoctors: res.data.totalDoctors || 0,
          appointmentsCount: apptStats.appointmentsCount, // Use dynamic count
          doctorStats: apptStats.doctorStats // Use dynamic stats list
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
    }
  };

  // Fetch Patients Chart
  const fetchChart = async () => {
    try {
      const res = await getPatientsChart(chartMonth, chartPage);
      if (res.data) {
        const data = res.data.patientStats || [];
        setTotalPatients(res.data.totalPatientsCount || 0);

        const formatted = data.map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short"
          }),
          new: item.newPatients || 0,
          old: item.oldPatients || 0,
        }));
        setChartData(formatted);
      }
    } catch (err) {
      console.error("Error fetching patient statistics chart:", err);
    }
  };

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [dashboardMonth, dashboardDay]);

  useEffect(() => {
    fetchChart();
  }, [chartMonth, chartPage]);

  // Dynamic pagination calculation
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };
  const daysInMonth = getDaysInMonth(today.getFullYear(), chartMonth);
  const totalPages = Math.ceil(daysInMonth / 7);

  const handlePrevPage = () => {
    if (chartPage > 1) setChartPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (chartPage < totalPages) setChartPage((p) => p + 1);
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-label"><strong>{label}</strong></p>
          {payload.map((p, i) => (
            <p key={i} className="tooltip-item" style={{ color: p.color }}>
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

  // Group stats by doctor name for quick lookup using normalized names
  const statsLookup = {};
  doctorStats.forEach((d) => {
    if (d.name) {
      statsLookup[normalizeDoctorName(d.name)] = d.value;
    }
  });

  const totalDoctorAppointments = doctorStats.reduce((sum, d) => sum + d.value, 0);
  const hasDoctorData = totalDoctorAppointments > 0;

  // Build doctor list with percentages dynamically mapped from the hospital list of doctors
  let doctorStatsWithPercentage = [];
  if (allDoctors.length > 0) {
    doctorStatsWithPercentage = allDoctors.map((doc) => {
      const normalizedDocName = normalizeDoctorName(doc.name);
      const count = statsLookup[normalizedDocName] || 0;
      const pct = totalDoctorAppointments > 0 ? Math.round((count / totalDoctorAppointments) * 100) : 0;
      return {
        name: doc.name,
        value: count,
        percentage: pct
      };
    });
  } else if (doctorStats.length > 0) {
    // Fallback if doctor list is empty/loading but we have stats
    doctorStatsWithPercentage = doctorStats.map((d) => {
      const pct = totalDoctorAppointments > 0 ? Math.round((d.value / totalDoctorAppointments) * 100) : 0;
      return {
        name: d.name,
        value: d.value,
        percentage: pct
      };
    });
  } else {
    // Absolute fallback if everything is empty
    doctorStatsWithPercentage = [
      { name: "Dr. John", value: 0, percentage: 0 },
      { name: "DR. Ahmed", value: 0, percentage: 0 },
      { name: "DR. Hassan", value: 0, percentage: 0 },
      { name: "Others", value: 0, percentage: 0 }
    ];
  }

  // Filter out doctors with 0 appointments for drawing the pie slices
  const activePieData = doctorStatsWithPercentage.filter((d) => d.value > 0);
  const pieData = hasDoctorData && activePieData.length > 0
    ? activePieData
    : [{ name: "No Data", value: 1 }];

  return (
    <div className="dashboard-container">
      {/* Upper header section with user profile matching design */}
      <div className="dashboard-header-block">
        <h2 className="dashboard-title">Activity Overview</h2>
        
        <div className="dashboard-profile-area">
          <div className="notification-bell-container">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            <span className="bell-badge"></span>
          </div>
          <div className="profile-details">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">{userRole}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Row inside their visual panel */}
      <div className="stats-cards-wrapper">
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-card-content">
              <h4>Total Beds</h4>
              <h2>{stats.totalBeds}</h2>
            </div>
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBed} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <h4>New Patients</h4>
              <h2>{stats.newPatients}</h2>
            </div>
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <h4>Total Doctors</h4>
              <h2>{stats.totalDoctors}</h2>
            </div>
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUserMd} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <h4>Appointments</h4>
              <h2>{stats.appointmentsCount}</h2>
            </div>
            <div className="stat-icon">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts layout row */}
      <div className="charts-container">

        {/* Appointments Distribution by Doctor */}
        <div className="chart-card-transparent pie-chart-card">
          <div className="chart-card-header">
            <h4>Appointments Distribution by Doctor</h4>
            <div className="chart-selects">
              {/* Day filter */}
              <select
                value={dashboardDay}
                onChange={(e) => setDashboardDay(Number(e.target.value))}
              >
                <option value="0">Day (All)</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    Day {i + 1}
                  </option>
                ))}
              </select>

              {/* Month filter */}
              <select
                value={dashboardMonth}
                onChange={(e) => {
                  setDashboardMonth(Number(e.target.value));
                  setDashboardDay(0); // reset day filter when month changes to prevent mismatch
                }}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    Month {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Horizontal layout: Legend left, Donut chart right */}
          <div className="pie-chart-layout">
            {/* Styled Legend matching mockup design */}
            <div className="pie-legend">
              {doctorStatsWithPercentage.map((item, index) => (
                <div key={index} className="pie-legend-item">
                  <span
                    className="pie-legend-dot"
                    style={{ backgroundColor: hasDoctorData && item.value > 0 ? COLORS[index % COLORS.length] : "#C4D8E4" }}
                  ></span>
                  <span className="pie-legend-name">{item.name}</span>
                  <span className="pie-legend-value">{item.percentage}%</span>
                </div>
              ))}
            </div>

            <div className="pie-chart-wrapper">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={hasDoctorData && activePieData.length > 1 ? 3 : 0}
                    animationDuration={800}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={hasDoctorData && activePieData.length > 0 ? COLORS[i % COLORS.length] : "#E5F0F7"} />
                    ))}
                  </Pie>
                  <Tooltip content={hasDoctorData && activePieData.length > 0 ? <CustomTooltip /> : () => null} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Patients Statistics Stacked Bar Chart */}
        <div className="chart-card bar-chart-card">
          <div className="chart-card-header">
            <div className="bar-chart-title-area">
              <h4>Patients Statistics</h4>
              <div className="bar-chart-subtitle-row">
                <p className="chart-total-label">
                  Total No of Patients : <span>{totalPatients}</span>
                </p>
                <div className="bar-legend">
                  <div className="bar-legend-item">
                    <span className="bar-legend-dot new-patients"></span>
                    <span>New Patients</span>
                  </div>
                  <div className="bar-legend-item">
                    <span className="bar-legend-dot old-patients"></span>
                    <span>Old Patients</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="chart-selects">
              <select
                value={chartMonth}
                onChange={(e) => {
                  setChartMonth(Number(e.target.value));
                  setChartPage(1); // reset to page 1
                }}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    Month {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bar-chart-wrapper">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="new"
                    name="New Patients"
                    fill="#004F78"
                    stackId="a"
                    radius={[0, 0, 0, 0]}
                    animationDuration={800}
                  />
                  <Bar
                    dataKey="old"
                    name="Old Patients"
                    fill="#CFDFEB"
                    stackId="a"
                    radius={[6, 6, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty-state">
                <p>No statistics available for this month</p>
              </div>
            )}
          </div>

          {/* Patients Statistics Pagination below chart */}
          <div className="chart-pagination">
            <div></div> {/* spacer to align pagination to right */}
            <div className="pagination-controls-right">
              <button
                className="prev-btn"
                onClick={handlePrevPage}
                disabled={chartPage === 1}
              >
                Previous
              </button>
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`page-num-btn ${chartPage === i + 1 ? "active" : ""}`}
                    onClick={() => setChartPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                className="next-btn"
                onClick={handleNextPage}
                disabled={chartPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;