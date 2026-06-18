import React from 'react';
import '../../styles/Home/Home.css';
import heroBg from '../../assets/images/home/hero-bg.jpg';

const Hero = () => {
  return (
    <div 
      id="home"
      className="hero-section" 
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>
          Your Health,
          <span>Our Priority</span>
        </h1>
      </div>
    </div>
  );
};

export default Hero;
