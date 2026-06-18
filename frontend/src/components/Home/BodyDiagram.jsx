import React, { useState } from 'react';
import '../../styles/Home/Home.css';
import bodyImg from '../../assets/images/home/body-diagram.jpg';

const specialties = [
  {
    id: "neurology",
    name: "Neurology",
    side: "right",
    dotX: 630, dotY: 282,
    cornerX: 800, cornerY: 295,
    labelX: 935, labelY: 295,
    htmlTop: "24.5%", htmlRight: "3%",
    icon: (color) => (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2"/>
        <path d="M12 6v12M12 6a3.5 3.5 0 0 0-3.5 3.5c0 1.2.6 2.3 1.5 3a3.5 3.5 0 0 1 0 5.5M12 6a3.5 3.5 0 0 1 3.5 3.5c0 1.2-.6 2.3-1.5 3a3.5 3.5 0 0 0 0 5.5"/>
      </svg>
    )
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    side: "left",
    dotX: 605, dotY: 310,
    cornerX: 470, cornerY: 320,
    labelX: 335, labelY: 320,
    htmlTop: "27%", htmlLeft: "3%",
    icon: (color) => (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    )
  },
  {
    id: "oral-surgery",
    name: "Oral & Maxillofacial Surgery",
    side: "right",
    dotX: 622, dotY: 330,
    cornerX: 800, cornerY: 360,
    labelX: 935, labelY: 360,
    htmlTop: "31%", htmlRight: "3%",
    icon: (color) => (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 0-4 4v5c0 3 2 5 4 7 2-2 4-4 4-7V6a4 4 0 0 0-4-4z"/>
        <path d="M8 11c0 2 1.5 3.5 3.5 4M16 11c0 2-1.5 3.5-3.5 4"/>
      </svg>
    )
  },
  {
    id: "cardiology",
    name: "Cardiology",
    side: "right",
    dotX: 650, dotY: 425,
    cornerX: 780, cornerY: 510,
    labelX: 935, labelY: 510,
    htmlTop: "45%", htmlRight: "3%",
    icon: (color) => (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    )
  },
  {
    id: "gastroenterology",
    name: "Gastroenterology",
    side: "left",
    dotX: 610, dotY: 490,
    cornerX: 470, cornerY: 468,
    labelX: 335, labelY: 468,
    htmlTop: "41%", htmlLeft: "3%",
    icon: (color) => (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c-1.5 0-3 1-3.5 2.5C8 7 7.5 9 8.5 11.5c1 2.5 3 4 5 5s4.5.5 5-1.5c.6-2.5-1.5-5.5-3.5-6.5C13 7.5 13.5 3 12 3z"/>
        <path d="M8.5 11.5c-2 1-3 3-2.5 5s3 3.5 5 3 3.5-2.5 3-4.5"/>
      </svg>
    )
  },
  {
    id: "urology",
    name: "Urology",
    side: "left",
    dotX: 618, dotY: 565,
    cornerX: 470, cornerY: 620,
    labelX: 335, labelY: 620,
    htmlTop: "56%", htmlLeft: "3%",
    icon: (color) => (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 5c1.5 0 3 2.5 3 5s-1.5 5-3 5-3-2.5-3-5 1.5-5 3-5zM18 5c1.5 0 3 2.5 3 5s-1.5 5-3 5-3-2.5-3-5 1.5-5 3-5z"/>
        <path d="M9 10c1 1 2 3 2 5v4M15 10c-1 1-2 3-2 5v4"/>
      </svg>
    )
  },
  {
    id: "rheumatology",
    name: "Rheumatology",
    side: "left",
    dotX: 598, dotY: 742,
    cornerX: 470, cornerY: 795,
    labelX: 335, labelY: 795,
    htmlTop: "73%", htmlLeft: "3%",
    icon: (color) => (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v7m0 4v7M9 7h6M9 17h6M10 10a2 2 0 0 1 4 0M10 14a2 2 0 0 0 4 0"/>
      </svg>
    )
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    side: "right",
    dotX: 642, dotY: 842,
    cornerX: 790, cornerY: 892,
    labelX: 935, labelY: 892,
    htmlTop: "82.5%", htmlRight: "3%",
    icon: (color) => (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 19c-1 0-4-1-6-3s-3-5-3-6 1-4 3-4h1v10M8 8V6a2 2 0 0 0-2-2H4"/>
        <path d="M4 16h6M4 20h14a2 2 0 0 0 2-2v-1"/>
      </svg>
    )
  }
];

const BodyDiagram = () => {
  const [hoveredSpecialty, setHoveredSpecialty] = useState(null);

  return (
    <div id="services" className="home-section body-diagram-section" style={{ overflow: 'hidden' }}>
      <h2 className="home-section-title" style={{ fontSize: '42px', marginBottom: '10px' }}>Where is the pain?</h2>
      <div className="title-divider"></div>

      <div className="interactive-body-outer">
        <div className="interactive-body-container">
          
          {/* Main Body Image - Renders naturally inside the relative container */}
          <img 
            src={bodyImg} 
            alt="Human Body Diagram" 
            className="body-diagram-main-image"
          />

          {/* SVG Overlay covering the image exactly (viewBox matches image dimensions 1280x1034) */}
          <svg viewBox="0 0 1280 1034" className="body-svg-overlay">
            {/* Render Connection Lines */}
            {specialties.map((spec) => {
              const isHovered = hoveredSpecialty === spec.id;
              return (
                <polyline
                  key={`line-${spec.id}`}
                  points={`${spec.dotX},${spec.dotY} ${spec.cornerX},${spec.cornerY} ${spec.labelX},${spec.labelY}`}
                  fill="none"
                  stroke={isHovered ? "#004f78" : "#1c5b7c"}
                  strokeWidth={isHovered ? "3.5" : "2"}
                  className="connection-line"
                  style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
                />
              );
            })}

            {/* Interactive SVG Hotspot Dots */}
            {specialties.map((spec) => {
              const isHovered = hoveredSpecialty === spec.id;
              return (
                <g 
                  key={`dot-${spec.id}`}
                  className="hotspot-group"
                  onMouseEnter={() => setHoveredSpecialty(spec.id)}
                  onMouseLeave={() => setHoveredSpecialty(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Glowing Outer Pulse Circle */}
                  <circle
                    cx={spec.dotX}
                    cy={spec.dotY}
                    r={isHovered ? "16" : "12"}
                    fill={isHovered ? "rgba(0, 79, 120, 0.35)" : "rgba(28, 91, 124, 0.2)"}
                    stroke={isHovered ? "#004f78" : "#1c5b7c"}
                    strokeWidth="1.5"
                    className="pulse-circle"
                    style={{ transition: "all 0.3s ease" }}
                  />
                  {/* Solid Center Dot */}
                  <circle
                    cx={spec.dotX}
                    cy={spec.dotY}
                    r="4"
                    fill={isHovered ? "#004f78" : "#1c5b7c"}
                  />
                </g>
              );
            })}
          </svg>

          {/* HTML Specialty Labels Positioned Over the SVG Layout */}
          {specialties.map((spec) => {
            const isHovered = hoveredSpecialty === spec.id;
            const style = spec.side === "left" 
              ? { top: spec.htmlTop, left: spec.htmlLeft }
              : { top: spec.htmlTop, right: spec.htmlRight };

            return (
              <div
                key={`label-${spec.id}`}
                className={`specialty-label-card ${spec.side} ${isHovered ? "active" : ""}`}
                style={style}
                onMouseEnter={() => setHoveredSpecialty(spec.id)}
                onMouseLeave={() => setHoveredSpecialty(null)}
              >
                {spec.side === "left" ? (
                  <>
                    <div className="specialty-card-icon">
                      {spec.icon(isHovered ? "#ffffff" : "#1c5b7c")}
                    </div>
                    <span className="specialty-card-name">{spec.name}</span>
                  </>
                ) : (
                  <>
                    <span className="specialty-card-name">{spec.name}</span>
                    <div className="specialty-card-icon">
                      {spec.icon(isHovered ? "#ffffff" : "#1c5b7c")}
                    </div>
                  </>
                )}
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default BodyDiagram;
