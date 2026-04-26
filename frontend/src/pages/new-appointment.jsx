import React, { useEffect, useState } from "react";
import "./new-appointment.css";
import { useNavigate } from "react-router-dom";

import {
  getPatients,
  getDoctors,
  getAvailableDates,
  getAvailableSlots,
  createAppointment
} from "../api/admin/appointmentsService";

const NewAppointment = () => {

  const navigate = useNavigate();

  const [patients,setPatients] = useState([]);
  const [filteredPatients,setFilteredPatients] = useState([]);

  const [doctors,setDoctors] = useState([]);
  const [dates,setDates] = useState([]);
  const [times,setTimes] = useState([]);

  const [form,setForm] = useState({
    patientId:"",
    doctorId:"",
    date:"",
    time:"",
    patientAge:"",
    visitType:"Consultation",
    notes:""
  });

  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(false);

  // load data
  useEffect(()=>{
    fetchInitial();
  },[]);

  const fetchInitial = async () => {
    const patientsRes = await getPatients();
    const doctorsRes = await getDoctors();

    setPatients(patientsRes.data || []);
    setFilteredPatients(patientsRes.data || []);

    setDoctors(doctorsRes.data || []);
  };

  // patient search
  const handleSearch = (e)=>{
    const value = e.target.value;
    setSearch(value);

    const filtered = patients.filter(p =>
      p.fullName.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredPatients(filtered);
  };

  // doctor change
  const handleDoctorChange = async (e)=>{
    const doctorId = e.target.value;

    setForm({...form,doctorId,date:"",time:""});
    setDates([]);
    setTimes([]);

    if(doctorId){
      const res = await getAvailableDates(doctorId);
      setDates(res);
    }
  };

  // date change
  const handleDateChange = async (e)=>{
    const date = e.target.value;

    setForm({...form,date,time:""});
    setTimes([]);

    if(date && form.doctorId){
      const res = await getAvailableSlots(form.doctorId,date);
      setTimes(res.availableTimes || []);
    }
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{
      setLoading(true);

      await createAppointment({
        ...form,
        patientId:Number(form.patientId),
        doctorId:Number(form.doctorId),
        patientAge:Number(form.patientAge)
      });

      navigate("/appointments");

    }catch(err){
      alert("Error creating appointment");
    }finally{
      setLoading(false);
    }
  };

  return (

    <div className="appointment-page">

      <div className="appointment-card">

        <div className="appointment-header">
          <span className="breadcrumb" onClick={()=>navigate("/appointments")}>
            ← Appointment Management
          </span>
          <h2>New Appointment</h2>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Patient Search */}
            <div className="form-group">
              <label>Patient *</label>

              <input
                placeholder="Search patient..."
                value={search}
                onChange={handleSearch}
              />

              <select
                value={form.patientId}
                onChange={(e)=>setForm({...form,patientId:e.target.value})}
                required
              >
                <option value="">Select Patient</option>
                {filteredPatients.map(p=>(
                  <option key={p.id} value={p.id}>
                    {p.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div className="form-group">
              <label>Doctor *</label>

              <select
                value={form.doctorId}
                onChange={handleDoctorChange}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(d=>(
                  <option key={d.doctorId} value={d.doctorId}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label>Date *</label>

              <select
                value={form.date}
                onChange={handleDateChange}
                required
              >
                <option value="">Select Date</option>
                {dates.map((d,i)=>(
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Time */}
            <div className="form-group">
              <label>Time *</label>

              <select
                value={form.time}
                onChange={(e)=>setForm({...form,time:e.target.value})}
                required
              >
                <option value="">Select Time</option>
                {times.map((t,i)=>(
                  <option key={i} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Age */}
            <div className="form-group">
              <label>Patient Age *</label>

              <input
                value={form.patientAge}
                onChange={(e)=>setForm({...form,patientAge:e.target.value})}
                required
              />
            </div>

            {/* Visit */}
            <div className="form-group">
              <label>Visit Type *</label>

              <select
                value={form.visitType}
                onChange={(e)=>setForm({...form,visitType:e.target.value})}
              >
                <option>Consultation</option>
                <option>Follow-up</option>
                <option>Emergency</option>
                <option>Surgery</option>
              </select>
            </div>

            {/* Notes */}
            <div className="form-group full-width">
              <label>Notes</label>

              <textarea
                value={form.notes}
                onChange={(e)=>setForm({...form,notes:e.target.value})}
              />
            </div>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={()=>navigate("/appointments")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="confirm-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Appointment"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );
};

export default NewAppointment;