import React, { useState } from "react";
import "./Reports.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getDaysInMonth = (month) => {
  const daysInMonth = { January: 31, February: 28, March: 31, April: 30, May: 31, June: 30, July: 31, August: 31, September: 30, October: 31, November: 30, December: 31 };
  return daysInMonth[month];
};

const generateAllDaysData = (month) => {
  const monthIndex = MONTHS.indexOf(month) + 1;
  const totalDays = getDaysInMonth(month);
  return Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    const seed = monthIndex * day;
    return {
      date: `${day} ${month.slice(0, 3)}`,
      Patients: (seed * 7) % 250 + 150,
      doctors: (seed * 5) % 200 + 180,
    };
  });
};

const generateCityData = (month, day) => {
  const seed = (MONTHS.indexOf(month) + 1) * day;
  const cairo = (seed * 7) % 40 + 30;
  const giza = (seed * 3) % 20 + 10;
  const fayoum = (seed * 5) % 20 + 10;
  const others = Math.max(100 - cairo - giza - fayoum, 5);
  return [
    { name: "Cairo", value: cairo },
    { name: "Giza", value: giza },
    { name: "Fayoum", value: fayoum },
    { name: "Others", value: others },
  ];
};

const COLORS = ["#1e4f73", "#9BB3C7", "#8FA9BE", "#c0392b"];
const DAYS_PER_PAGE = 10;

const Reports = () => {
  const [growthMonth, setGrowthMonth] = useState("May");
  const [growthPage, setGrowthPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [selectedDay, setSelectedDay] = useState(1);

  const allDaysData = generateAllDaysData(growthMonth);
  const totalPages = Math.ceil(allDaysData.length / DAYS_PER_PAGE);
  const paginatedData = allDaysData.slice((growthPage - 1) * DAYS_PER_PAGE, growthPage * DAYS_PER_PAGE);

  const cityDays = Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1);
  const cityData = generateCityData(selectedMonth, selectedDay);

  const handleExportExcel = (section) => alert(`Exporting ${section} as Excel...`);
  const handleExportPdf = (section) => alert(`Exporting ${section} as PDF...`);

  const handleMonthChange = (month) => {
    setGrowthMonth(month);
    setGrowthPage(1);
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h2 className="reports-title">Reports & Analytics</h2>
          <p className="reports-subtitle">Manage your personal information and settings</p>
        </div>
      </div>

      <div className="reports-card">

        {/* User Growth */}
        <div className="chart-section">
          <div className="chart-top">
            <h3 className="chart-title">User Growth</h3>
            <select className="chart-filter" value={growthMonth} onChange={(e) => handleMonthChange(e.target.value)}>
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="chart-meta">
            <span className="total-label">Total No of Patients : <strong>480</strong></span>
            <div className="chart-legend-inline">
              <span><span className="dot" style={{ background: "#1e4f73" }}></span> Patients</span>
              <span><span className="dot" style={{ background: "#9BB3C7" }}></span> doctors</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={paginatedData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d9e5ef" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#1e4f73" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#1e4f73" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="Patients" fill="#1e4f73" radius={[4, 4, 0, 0]} />
              <Bar dataKey="doctors" fill="#9BB3C7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="page-btn nav-btn"
              onClick={() => setGrowthPage((p) => Math.max(p - 1, 1))}
              disabled={growthPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${growthPage === page ? "active" : ""}`}
                onClick={() => setGrowthPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="page-btn nav-btn"
              onClick={() => setGrowthPage((p) => Math.min(p + 1, totalPages))}
              disabled={growthPage === totalPages}
            >
              Next
            </button>
          </div>

          <div className="export-btns">
            <button className="export-btn excel" onClick={() => handleExportExcel("User Growth")}>Export Excel</button>
            <button className="export-btn pdf" onClick={() => handleExportPdf("User Growth")}>Export Pdf</button>
          </div>
        </div>

        <div className="divider" />

        {/* Hospital Distribution by City */}
        <div className="chart-section">
          <div className="chart-top">
            <h3 className="chart-title">Hospital Distribution by City</h3>
            <div className="chart-filters">
              <select
                className="chart-filter"
                value={selectedMonth}
                onChange={(e) => { setSelectedMonth(e.target.value); setSelectedDay(1); }}
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pie-wrapper">
            <div className="pie-legend">
              {cityData.map((item, i) => (
                <div key={i} className="legend-item">
                  <span className="legend-dot" style={{ background: COLORS[i] }}></span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={cityData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  label={({ value }) => `${value}%`}
                  labelLine={false}
                >
                  {cityData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="export-btns">
            <button className="export-btn excel" onClick={() => handleExportExcel("City Distribution")}>Export Excel</button>
            <button className="export-btn pdf" onClick={() => handleExportPdf("City Distribution")}>Export Pdf</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;