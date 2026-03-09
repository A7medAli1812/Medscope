import React from "react";
import "./MultiHospitalView.css";

const MultiHospitalView = () => {

const hospitals = [

{
name:"Al Ameen Hospital",
beds:[
{title:"Total Beds",used:55,total:100},
{title:"ICU Beds",used:30,total:40},
{title:"Emergency Beds",used:2,total:30},
{title:"Pediatric Beds",used:23,total:30}
]
},

{
name:"Maka Hospital",
beds:[
{title:"Total Beds",used:55,total:150},
{title:"ICU Beds",used:30,total:50},
{title:"Emergency Beds",used:25,total:45},
{title:"Pediatric Beds",used:12,total:55}
]
}

];

return (

<div className="multi-page">

<h2 className="page-title">Multi-Hospital View</h2>

{hospitals.map((hospital,index)=>(

<div className="hospital-card" key={index}>

<div className="hospital-header">

<div className="hospital-icon">
<i className="fas fa-hospital"></i>
</div>

<h3>{hospital.name}</h3>

</div>

<div className="beds-container">

{hospital.beds.map((bed,i)=>{

const percent=(bed.used/bed.total)*100;

return(

<div className="bed-row" key={i}>

<div className="bed-label">

<span>{bed.title}</span>

<span className="bed-count">

{bed.used}/{bed.total} beds

</span>

</div>

<div className="progress-bar">

<div
className="progress"
style={{width:`${percent}%`}}
></div>

</div>

</div>

);

})}

</div>

</div>

))}

</div>

);

};

export default MultiHospitalView;