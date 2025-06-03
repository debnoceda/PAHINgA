import React from 'react';
import { useNavigate } from 'react-router-dom';
import happyImg from '../assets/HappyAnim2/PNG_0023.png';
import sadImg from '../assets/SadAnim/PNG_0023.png';
import angryImg from '../assets/AngryAnim/PNG_0023.png';
import fearImg from '../assets/FearAnim/PNG_0023.png';
import disgustImg from '../assets/DisgustAnim/PNG_0023.png';
import '../styles/EntryCover.css';

const moodConfig = {
  Happy:   { img: happyImg,   bg: '#FEF6BE' },
  Sad:     { img: sadImg,     bg: '#BDEEFF' },
  Anger:   { img: angryImg,   bg: '#FFC5B7' },
  Fear:    { img: fearImg,    bg: '#F1D5FF' },
  Disgust: { img: disgustImg, bg: '#C8F0C6' },
};

const EntryCover = ({ id, title, date, mood }) => {
  const navigate = useNavigate();
  const { img, bg } = moodConfig[mood] || moodConfig.Happy;

  const handleClick = () => {
    navigate(`/entry/${id}`);
  };

  return (
    <button className="entry-cover-container" onClick={handleClick}>
      <div
        className="entry-cover-image-bg"
        style={{ background: bg }}
      >
        <img
          src={img}
          alt={`${mood} Marshmallow`}
          className="entry-cover-image"
        />
      </div>
      <div className="entry-cover-content">
        <p className="entry-cover-title">{title || "Untitled"}</p>
        <p className="entry-cover-date small-text">{date}</p>
      </div>
    </button>
  );
};

export default EntryCover;