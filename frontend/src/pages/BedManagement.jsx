import React, { useState } from "react";
import "./BedManagement.css";

const BedManagement = () => {

const [beds,setBeds] = useState([
{ title:"ICU", used:32, total:50 },
{ title:"Emergency", used:12, total:22 },
{ title:"Pediatric", used:17, total:30 },
{ title:"Operating Room (OR) Beds", used:6, total:19 }
]);

// إضافة سرير
const increaseBed = (index)=>{

setBeds(prev=>{

const updated=[...prev];

if(updated[index].used < updated[index].total){

updated[index].used +=1;

}

return updated;

});

};

// حجز سرير
const decreaseBed = (index)=>{

setBeds(prev=>{

const updated=[...prev];

if(updated[index].used > 0){

updated[index].used -=1;

}

return updated;

});

};

return (

<div className="bed-page">

<h2 className="page-title">Bed Management</h2>

<div className="bed-grid">

{beds.map((bed,index)=>{

const percentage = (bed.used / bed.total) * 100;

return(

<div className="bed-card" key={index}>

<div className="bed-header">

<i className="fas fa-bed"></i>

</div>

<div className="bed-info">

<h3>{bed.title}</h3>

<div className="bed-count">

{bed.used}/{bed.total}

<div className="bed-icons">

<i
className="fas fa-arrow-up"
onClick={()=>increaseBed(index)}
></i>

<i
className="fas fa-arrow-down"
onClick={()=>decreaseBed(index)}
></i>

</div>

</div>

</div>

<div className="progress-bar">

<div
className="progress"
style={{width:`${percentage}%`}}
></div>

</div>

</div>

);

})}

</div>

</div>

);

};

export default BedManagement;