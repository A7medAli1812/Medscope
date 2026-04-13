import React, { useState } from "react";
import "./Patients.css";

const Patients = () => {

const [patients] = useState([
{id:1,name:"Elizabeth Polson",age:32,gender:"Female",blood:"B+ve",phone:"+91 12345 67890",email:"elisabethpolson@hotmail.com"},
{id:2,name:"John David",age:28,gender:"Male",blood:"B+ve",phone:"+91 12345 67890",email:"davidjohn22@gmail.com"},
{id:3,name:"Krishika Vojan",age:24,gender:"Male",blood:"AB+ve",phone:"+91 12345 67890",email:"krishnavojan23@gmail.com"},
{id:4,name:"Sumanth Tinson",age:26,gender:"Male",blood:"O+ve",phone:"+91 12345 67890",email:"tinsontim@gmail.com"},
{id:5,name:"EG Subramani",age:77,gender:"Male",blood:"AB+ve",phone:"+91 12345 67890",email:"egs1332@gmail.com"},
{id:6,name:"Ranjan Moari",age:77,gender:"Male",blood:"O+ve",phone:"+91 12345 67890",email:"ranjanmoari@yahoo.com"},
{id:7,name:"Philipie Gopal",age:55,gender:"Male",blood:"O-ve",phone:"+91 12345 67890",email:"gopal22@gmail.com"}
]);

const [search,setSearch] = useState("");
const [genderFilter,setGenderFilter] = useState("");
const [currentPage,setCurrentPage] = useState(1);

const patientsPerPage = 10;

const filteredPatients = patients.filter((p)=>{
return(
p.name.toLowerCase().includes(search.toLowerCase()) &&
(genderFilter === "" || p.gender === genderFilter)
)
});

const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

const startIndex = (currentPage - 1) * patientsPerPage;

const currentPatients = filteredPatients.slice(
startIndex,
startIndex + patientsPerPage
);

return (

<div className="patients-container">

<h1 className="page-title">Patient Details</h1>

<div className="patients-card">

<div className="patients-header">
<h3>Patient Info</h3>
</div>

<div className="patients-filters">

<div className="search-box">

<i className="fas fa-search search-icon"></i>

<input
type="text"
placeholder="Search"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>

<select
className="gender-filter"
value={genderFilter}
onChange={(e)=>setGenderFilter(e.target.value)}
>
<option value="">Filter by Gender</option>
<option value="Male">Male</option>
<option value="Female">Female</option>
</select>

</div>

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

{currentPatients.map((patient,index)=>(
<tr key={patient.id}>

<td className="patient-name">

<img
src={`https://i.pravatar.cc/40?img=${index+10}`}
alt=""
className="patient-avatar"
/>

{patient.name}

</td>

<td>{patient.age}</td>
<td>{patient.gender}</td>
<td>{patient.blood}</td>
<td>{patient.phone}</td>
<td>{patient.email}</td>

</tr>
))}

</tbody>

</table>

<div className="pagination">

<button
className="page-btn"
disabled={currentPage === 1}
onClick={()=>setCurrentPage(currentPage - 1)}
>
Previous
</button>

{Array.from({length: totalPages},(_,i)=>(
<button
key={i}
className={
currentPage === i+1
? "page-number active"
: "page-number"
}
onClick={()=>setCurrentPage(i+1)}
>
{i+1}
</button>
))}

<button
className="page-btn"
disabled={currentPage === totalPages}
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