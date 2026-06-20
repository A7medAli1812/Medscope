import React, { useEffect, useState } from "react";
import "./Doctors.css";
import { getDoctors } from "../api/admin/doctors";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await getDoctors({
        page,
        pageSize,
        search,
        specialty,
      });

      setDoctors(res.data || []);
      setTotalCount(res.totalCount || 0);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, search, specialty]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="doctors-page">
      <h2 className="page-title">Doctors Management</h2>

      <div className="table-container">
        {/* HEADER */}
        <div className="table-header">
          <h3>Doctors info</h3>

          {/* 🔥 BUTTON مربوط بالصفحة */}
          <button
            className="new-btn"
            onClick={() => navigate("/new-doctor")}
          >
            + New Doctor
          </button>
        </div>

        {/* FILTERS */}
        <div className="filters">
          <input
            className="search-input"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-btn"
            value={specialty}
            onChange={(e) => {
              setSpecialty(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Specialties</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>
        </div>

        {/* TABLE */}
        <table className="doctors-table">
          <thead>
            <tr>
              <th>DOCTOR ID</th>
              <th>NAME</th>
              <th>SPECIALTY</th>
              <th>PHONE NUMBER</th>
              <th>EMAIL</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading">
                  Loading...
                </td>
              </tr>
            ) : (
              doctors.map((doc, index) => (
                <tr key={doc.doctorId}>
                  <td>
                    DOC{String((page - 1) * pageSize + index + 1).padStart(3, "0")}
                  </td>
                  <td>{doc.name}</td>
                  <td>{doc.specialty}</td>
                  <td>{doc.phoneNumber}</td>
                  <td>{doc.email}</td>
                  <td>
                    <span
                      className={`status ${
                        doc.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <span onClick={() => handlePageChange(page - 1)}>Previous</span>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <span onClick={() => handlePageChange(page + 1)}>Next</span>
        </div>
      </div>
    </div>
  );
};

export default Doctors;