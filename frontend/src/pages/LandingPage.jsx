import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';
import mallow from '../assets/Mallow.png';
import mascot1 from '../assets/GIFs/SadAnim.gif';
import mascot2 from '../assets/GIFs/AngryAnim.gif';
import mascot3 from '../assets/GIFs/HappyAnim.gif';
import mascot4 from '../assets/GIFs/FearAnim.gif';
import mascot5 from '../assets/GIFs/DisgustAnim.gif';


function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.padding = '0';
    document.body.style.overflowY = 'hidden';
    return () => {
      document.body.style.padding = '';
      document.body.style.overflowY = 'auto';
    };
  }, []);

  return (
    <div className="landing-container">
      <img src="Landing2.gif" alt="Background Animation" className="background-video" />

      <div className="mascot-section">
        <img src={mallow} alt="Mascot" className="mascot-image" />
      </div>

      <div className="content-section">
        <h1>PAHINgA</h1>
        <p>Pause. Breathe. Begin Again.</p>

        <div className="mini-mascots">
          {[mascot1, mascot2, mascot3, mascot4, mascot5].map((src, index) => (
            <img key={index} src={src} alt={`Mini Mascot ${index + 1}`} className="mini-mascot-image" />
          ))}
        </div>

        <div className="button-group">
          <button className="custom-button medium-compact" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="custom-button medium-compact" onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
