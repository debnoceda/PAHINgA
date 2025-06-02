import welcomeImage from '../assets/WelcomePic2.png'; // adjust path as needed
import '../styles/Welcome.css'; // optional CSS
import Button from '../components/Button';

import { useNavigate } from "react-router-dom";
import React from 'react';


const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/");
  };

  return (
    <div className="welcome-container">
      <img src={welcomeImage} alt="Welcome" className="welcome-image" />  
      <h1 className="welcome-title">Welcome to Our App!</h1>
      <Button type='medium-compact' className="get-started-button" onClick={() => handleGetStarted()}>
        Get Started
      </Button>
    </div>
  );
};

export default Welcome;