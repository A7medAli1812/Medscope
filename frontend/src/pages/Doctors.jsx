import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Doctors.css";

const Doctors = () => {

const navigate = useNavigate();

const [search,setSearch] = useState("");
const [filter,setFilter] = useState("");

const doctors = [
{
id:"DOC001",
name:"Dr. Ahmed Hassan",
specialty:"Cardiology",
phone:"+91 12345 67890",
email:"ahmed@gmail.com",
status:"Active"
},
{
id:"DOC002",
name:"Dr. Ahmed Hassan",
specialty:"Pediatrics",
phone:"+91 12345 67890",
email:"david@gmail.com",
status:"Active"
},
{
id:"DOC003",
name:"Dr. Ahmed Hassan",
specialty:"Orthopedics",
phone:"+91 12345 67890",
email:"krishna@gmail.com",
status:"Inactive"
},
{
id:"DOC004",
name:"Dr. Ahmed Hassan",
specialty:"Orthopedics",
phone:"+91 12345 67890",
email:"tintin@gmail.com",
status:"Active"
},
{
id:"DOC005",
name:"Dr. Ahmed Hassan",
specialty:"Cardiology",
phone:"+91 12345 67890",
email:"egs@gmail.com",
status:"Active"
},
{
id:"DOC006",
name:"Dr. Ahmed Hassan",
specialty:"Pediatrics",
phone:"+91 12345 67890",
email:"ranjan@gmail.com",
status:"Inactive"
}
];


const filteredDoctors = doctors.filter(doc =>

doc.name.toLowerCase().includes(search.toLowerCase()) &&
(filter === "" || doc.specialty === filter)

);


return (

<div className="doctors-page">

<h2 className="page-title">Doctors Management</h2>

<div className="doctors-card">

{/* HEADER */}

<div className="card-header">

<h3>Doctors info</h3>

<button
className="new-doctor-btn"
onClick={() => navigate("/new-doctor")}
>
+ New Doctor
</button>

</div>


{/* SEARCH + FILTER */}

<div className="filters">

<div className="search-box">

<i className="fas fa-search"></i>

<input
type="text"
placeholder="Search"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>


<select
className="filter-select"
value={filter}
onChange={(e)=>setFilter(e.target.value)}
>

<option value="">Filter by Specialty</option>
<option value="Cardiology">Cardiology</option>
<option value="Pediatrics">Pediatrics</option>
<option value="Orthopedics">Orthopedics</option>

</select>

</div>


{/* TABLE */}

<table className="doctors-table">

<thead>

<tr>

<th>Doctor ID</th>
<th>Name</th>
<th>Specialty</th>
<th>Phone Number</th>
<th>Email</th>
<th>Action</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{filteredDoctors.map((doc)=> (

<tr key={doc.id}>

<td>{doc.id}</td>

<td className="doctor-name">

<img src="https://i.pravatar.cc/40" alt="" />

{doc.name}

</td>

<td>{doc.specialty}</td>

<td>{doc.phone}</td>

<td>{doc.email}</td>

<td>

<button className="edit-btn">

<i className="fas fa-pen"></i>

</button>

</td>

<td>

<span className={doc.status === "Active" ? "status-active" : "status-inactive"}>

{doc.status}

</span>

</td>

</tr>

))}

</tbody>

</table>


{/* PAGINATION */}

<div className="pagination">

<button className="page-btn">Previous</button>

<div className="pages">

<span className="active">1</span>
<span>2</span>
<span>3</span>
<span>4</span>

</div>

<button className="page-btn">Next</button>

</div>

</div>

</div>

);

};

export default Doctors;