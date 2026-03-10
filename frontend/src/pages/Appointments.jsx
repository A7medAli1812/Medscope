import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Appointments.css";

const Appointments = () => {

const navigate = useNavigate();

const [activeTab,setActiveTab] = useState("new");
const [search,setSearch] = useState("");
const [selectedDate,setSelectedDate] = useState("");
const [currentPage,setCurrentPage] = useState(1);

const appointmentsPerPage = 10;

const appointments = [

{time:"9:30 AM",date:"2025-05-12",patient:"Elizabeth Polson",age:32,doctor:"Dr. John",visit:"Consultation",status:"new"},
{time:"10:00 AM",date:"2025-05-12",patient:"John David",age:36,doctor:"Dr. Roa",visit:"Follow-up",status:"new"},
{time:"10:30 AM",date:"2025-05-12",patient:"Krishtav Rajan",age:24,doctor:"Dr. Joel",visit:"Consultation",status:"new"},
{time:"11:00 AM",date:"2025-05-12",patient:"Muslam",age:26,doctor:"Dr. John",visit:"Consultation",status:"new"},
{time:"11:30 AM",date:"2025-05-12",patient:"EG Subramani",age:77,doctor:"Dr. lina",visit:"Surgery",status:"new"},
{time:"12:00 PM",date:"2025-05-12",patient:"Ranjan Maari",age:67,doctor:"Dr. nova",visit:"Consultation",status:"completed"},
{time:"12:30 PM",date:"2025-05-12",patient:"jony",age:55,doctor:"Dr. alex",visit:"Surgery",status:"completed"}

];

const filteredTab = appointments.filter(a => a.status === activeTab);

const searched = filteredTab.filter(a =>
a.patient.toLowerCase().includes(search.toLowerCase())
);

const filtered = selectedDate
? searched.filter(a => a.date === selectedDate)
: searched;

const totalPages = Math.ceil(filtered.length / appointmentsPerPage);

const start = (currentPage-1) * appointmentsPerPage;

const currentAppointments = filtered.slice(
start,
start + appointmentsPerPage
);

return (

<div className="appointments-container">

<h2 className="page-title">Appointments</h2>

<div className="appointments-card">

<div className="appointments-header">

<div className="tabs">

<button
className={activeTab==="new"?"tab active":"tab"}
onClick={()=>{setActiveTab("new");setCurrentPage(1)}}
>
NEW APPOINTMENTS
</button>

<button
className={activeTab==="completed"?"tab active":"tab"}
onClick={()=>{setActiveTab("completed");setCurrentPage(1)}}
>
COMPLETED APPOINTMENTS
</button>

</div>

<button
className="new-appointment"
onClick={()=>navigate("/new-appointment")}
>
+ New Appointment
</button>

</div>

<div className="filters">

<input
className="search"
placeholder="Search"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<div className="date-filter">

<input
type="date"
value={selectedDate}
onChange={(e)=>setSelectedDate(e.target.value)}
/>

<button className="filter-btn">

Filter by Date

<i className="fas fa-calendar"></i>

</button>

</div>

</div>

<table className="appointments-table">

<thead>

<tr>

<th>Time</th>
<th>Date</th>
<th>Patient Name</th>
<th>Patient Age</th>
<th>Doctor</th>
<th>Visit Type</th>

{activeTab==="new" && <th>User Action</th>}

</tr>

</thead>

<tbody>

{currentAppointments.map((a,i)=>(

<tr key={i}>

<td>{a.time}</td>
<td>{a.date}</td>

<td className="patient-name">

<img
src={`https://i.pravatar.cc/40?img=${i+10}`}
alt=""
className="avatar"
/>

{a.patient}

</td>

<td>{a.age}</td>
<td>{a.doctor}</td>
<td>{a.visit}</td>

{activeTab==="new" && (

<td className="actions">

<button className="reschedule">
Reschedule
</button>

<button className="delete">
×
</button>

</td>

)}

</tr>

))}

</tbody>

</table>

<div className="pagination">

<button
disabled={currentPage===1}
onClick={()=>setCurrentPage(currentPage-1)}
>
Previous
</button>

{Array.from({length:totalPages},(_,i)=>(

<button
key={i}
className={currentPage===i+1?"active":""}
onClick={()=>setCurrentPage(i+1)}
>
{i+1}
</button>

))}

<button
disabled={currentPage===totalPages}
onClick={()=>setCurrentPage(currentPage+1)}
>
Next
</button>

</div>

</div>

</div>

);

};

export default Appointments;