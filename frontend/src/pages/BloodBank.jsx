import React, { useState } from "react";
import "./BloodBank.css";

const BloodBank = () => {

  const [bloodData,setBloodData] = useState([
    { type:"A+", quantity:45 },
    { type:"A-", quantity:8 },
    { type:"B+", quantity:38 },
    { type:"B-", quantity:18 },
    { type:"AB+", quantity:22 },
    { type:"AB-", quantity:6 },
    { type:"O+", quantity:5 },
    { type:"O-", quantity:12 }
  ]);

  const updateQuantity = (index,value)=>{
    const updated = [...bloodData];
    updated[index].quantity = value;
    setBloodData(updated);
  };

  return (

    <div className="blood-container">

      <h1 className="blood-title">
        <span className="blood-icon">🩸</span>
        Blood Bank
      </h1>

      <div className="blood-grid">

        {bloodData.map((blood,index)=>{

          const status =
          blood.quantity < 10
          ? "Low Stock"
          : "In Stock";

          return(

            <div key={index} className="blood-card">

              <div className="blood-type">
                {blood.type}
              </div>

              <p className="blood-label">
                Quantity (units)
              </p>

              <input
                type="number"
                className="blood-input"
                value={blood.quantity}
                onChange={(e)=>updateQuantity(index,e.target.value)}
              />

              <p className={`blood-status ${status === "Low Stock" ? "low" : ""}`}>
                Status: {status}
              </p>

            </div>

          );
        })}

      </div>

    </div>

  );
};

export default BloodBank;