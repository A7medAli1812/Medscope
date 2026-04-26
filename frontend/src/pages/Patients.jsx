import React, { useEffect, useState } from "react";
import "./Patients.css";
import { getPatients } from "../api/admin/patients";

const Patients = () => {

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const patientsPerPage = 10;

  // 🔥 fetch data
  const fetchPatients = async () => {
    try {
      setLoading(true);

      const res = await getPatients({
        Search: search,
        Page: currentPage,
        PageSize: patientsPerPage,
        Gender: genderFilter
      });

      const data = res.data?.data || res.data || [];
      setPatients(data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 👇 reload لما الفلتر يتغير
  useEffect(() => {
    fetchPatients();
  }, [search, genderFilter, currentPage]);

  return (
    <div className="patients-container">

      <h1 className="page-title">Patient Details</h1>

      <div className="patients-card">

        <div className="patients-header">
          <h3>Patient Info</h3>
        </div>

        {/* 🔍 Filters */}
        <div className="patients-filters">

          <div className="search-box">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e)=>{
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className="gender-filter"
            value={genderFilter}
            onChange={(e)=>{
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Filter by Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

        </div>

        {/* 📊 Table */}
        <table className="patients-table">

          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Phone Number</th>
              <th>Email ID</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : patients.length > 0 ? (

              patients.map((p) => (
                <tr key={p.id}>

                 <td>{p.fullName}</td>
                  <td>{p.age || "-"}</td>
                  <td>{p.gender}</td>
                  <td>{p.bloodGroup}</td>
                  <td>{p.phoneNumber}</td>
                  <td>{p.email}</td>

                </tr>
              ))

            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Data
                </td>
              </tr>
            )}

          </tbody>

        </table>

        {/* 🔄 Pagination */}
        <div className="pagination">

          <button
            disabled={currentPage === 1}
            onClick={()=>setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <button className="active">
            {currentPage}
          </button>

          <button
            onClick={()=>setCurrentPage(currentPage + 1)}
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default Patients;