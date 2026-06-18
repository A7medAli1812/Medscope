import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Partners from '../components/Home/Partners';
import BodyDiagram from '../components/Home/BodyDiagram';
import ManagementTools from '../components/Home/ManagementTools';
import '../styles/Home/Home.css';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="home-page">
      <Hero />
      <Features />
      <Partners />
      <BodyDiagram />
      <ManagementTools />
    </div>
  );
};

export default Home;