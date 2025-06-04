import welcomeImage from '../assets/WelcomePic2.png'; // adjust path as needed
import '../styles/Welcome.css'; // optional CSS
import Button from '../components/Button';
import { useNavigate } from "react-router-dom";
import React from 'react';
import api from '../api';
import { useUser } from '../context/UserContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { fetchUserData } = useUser();

  const handleGetStarted = async () => {
    try {
      await api.post('/users/mark_welcome_seen/');
      await fetchUserData(); // Refresh user data to update the profile
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Error marking welcome as seen:', error);
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="welcome-container">
      <img src={welcomeImage} alt="Welcome" className="welcome-image" />  
      <h1 className="welcome-title">Welcome to Our App!</h1>
      <Button type='medium-compact' className="get-started-button" onClick={handleGetStarted}>
        Get Started
      </Button>
    </div>
  );
};

export default Welcome;