import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./new-doctor.css";

const NewDoctor = () => {

const navigate = useNavigate();

const [showPopup,setShowPopup] = useState(false);

const [formData,setFormData] = useState({
name:"",
specialty:"",
email:"",
phone:"",
status:"",
password:""
});

const handleChange = (e)=>{

setFormData({
...formData,
[e.target.name]: e.target.value
});

};

const handleSubmit = (e)=>{

e.preventDefault();

/* هنا بعدين هنربط API */

setShowPopup(true);

};

const handleAddAnother = ()=>{

setFormData({
name:"",
specialty:"",
email:"",
phone:"",
status:"",
password:""
});

setShowPopup(false);

};

return (

<div className="add-doctor-page">

<div className="doctor-card">

<h2 className="title">

<i className="fas fa-user-md"></i>

Add Doctor

</h2>

<form onSubmit={handleSubmit}>

<div className="form-grid">


<div className="form-group">

<label>Full Name *</label>

<input
type="text"
name="name"
value={formData.name}
onChange={handleChange}
required
/>

</div>


<div className="form-group">

<label>Major / Specialty *</label>

<select
name="specialty"
value={formData.specialty}
onChange={handleChange}
required
>

<option value="">Select Specialty</option>
<option>Cardiology</option>
<option>Pediatrics</option>
<option>Orthopedics</option>

</select>

</div>


<div className="form-group">

<label>Email Address *</label>

<input
type="email"
name="email"
value={formData.email}
onChange={handleChange}
required
/>

</div>


<div className="form-group">

<label>Phone Number *</label>

<input
type="text"
name="phone"
value={formData.phone}
onChange={handleChange}
required
/>

</div>


<div className="form-group">

<label>Status *</label>

<select
name="status"
value={formData.status}
onChange={handleChange}
required
>

<option value="">Select Status</option>
<option>Active</option>
<option>Inactive</option>

</select>

</div>


<div className="form-group">

<label>Password *</label>

<input
type="password"
name="password"
value={formData.password}
onChange={handleChange}
required
/>

</div>

</div>


<div className="form-buttons">

<button
type="button"
className="cancel-btn"
onClick={()=>navigate("/doctors")}
>

Cancel

</button>


<button
type="submit"
className="add-btn"
>

Add Doctor

</button>

</div>

</form>

</div>


{/* SUCCESS POPUP */}

{showPopup && (

<div className="popup-overlay">

<div className="popup">

<div className="success-icon">

<i className="fas fa-check"></i>

</div>

<h3>Account created successfully!</h3>


<div className="popup-buttons">

<button
className="add-another"
onClick={handleAddAnother}
>

Add Another

</button>


<button
className="back-btn"
onClick={()=>navigate("/home")}
>

Back to Home

</button>

</div>

</div>

</div>

)}

</div>

);

};

export default NewDoctor;