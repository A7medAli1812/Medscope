import React, { useState } from "react";
import "./new-appointment.css";

const NewAppointment = () => {

const [form,setForm] = useState({
patient:"Elizabeth Polson",
doctor:"Dr. John",
date:"2025-12-05",
time:"09:30",
age:"32",
visit:"Consultation",
notes:""
});

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const handleSubmit = (e)=>{
e.preventDefault();
console.log(form);
};

return (

<div className="appointment-page">

<div className="appointment-card">

<div className="appointment-header">

<span className="breadcrumb">

← Appointment Management

</span>

<h2>Rescheduled Appointment</h2>

</div>

<form onSubmit={handleSubmit}>

<div className="form-grid">

{/* Patient */}

<div className="form-group">

<label>Patient *</label>

<input
name="patient"
value={form.patient}
onChange={handleChange}
/>

</div>

{/* Doctor */}

<div className="form-group">

<label>Doctor *</label>

<select
name="doctor"
value={form.doctor}
onChange={handleChange}
>

<option>Dr. John</option>
<option>Dr. Joel</option>
<option>Dr. Nova</option>

</select>

</div>

{/* Date */}

<div className="form-group">

<label>Date & Time *</label>

<input
type="datetime-local"
name="date"
value={form.date}
onChange={handleChange}
/>

</div>

{/* Age */}

<div className="form-group">

<label>Patient Age *</label>

<input
name="age"
value={form.age}
onChange={handleChange}
/>

</div>

{/* Visit Type */}

<div className="form-group">

<label>Visit Type *</label>

<select
name="visit"
value={form.visit}
onChange={handleChange}
>

<option>Consultation</option>
<option>Follow-up</option>
<option>Emergency</option>
<option>Surgery</option>

</select>

</div>

{/* Notes */}

<div className="form-group">

<label>Notes (Optional)</label>

<textarea
name="notes"
placeholder="Add any relevant notes for the appointment..."
value={form.notes}
onChange={handleChange}
/>

</div>

</div>

<div className="form-actions">

<button
type="button"
className="cancel-btn"
>

Cancel

</button>

<button
type="submit"
className="confirm-btn"
>

Confirm Reschedule

</button>

</div>

</form>

</div>

</div>

);

};

export default NewAppointment;