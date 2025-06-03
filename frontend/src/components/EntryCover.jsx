import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import happyImg from '../assets/HappyAnim2/PNG_0023.png';
import sadImg from '../assets/SadAnim/PNG_0023.png';
import angryImg from '../assets/AngryAnim/PNG_0023.png';
import fearImg from '../assets/FearAnim/PNG_0023.png';
import disgustImg from '../assets/DisgustAnim/PNG_0023.png';
import '../styles/EntryCover.css';
import { useUser } from '../context/UserContext';

const moodConfig = {
  happy:   { img: happyImg,   bg: '#FEF6BE' },
  sad:     { img: sadImg,     bg: '#BDEEFF' },
  anger:   { img: angryImg,   bg: '#FFC5B7' },
  fear:    { img: fearImg,    bg: '#F1D5FF' },
  disgust: { img: disgustImg, bg: '#C8F0C6' },
};

const EntryCover = ({ id, title, date, mood }) => {
  const navigate = useNavigate();
  const { deleteEntry } = useUser();
  const { img, bg } = moodConfig[mood] || moodConfig.happy; // default to happy if mood is not found BUT WILL CHANGE TO NEUTRAL
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleClick = (e) => {
    if (e.target.closest('.entry-cover-delete-btn')) return;
    navigate(`/entry/${id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteEntry(id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <button className="entry-cover-container" onClick={handleClick}>
        <div className="entry-cover-image-bg" style={{ background: bg }}>
          <img
            src={img}
            alt={`${mood} Marshmallow`}
            className="entry-cover-image"
          />
          <button
            className="entry-cover-delete-btn"
            onClick={handleDelete}
            title="Delete entry"
          >
            <Icon icon="ic:round-delete" width="24" height="24" />
          </button>
        </div>
        <div className="entry-cover-content">
          <p className="entry-cover-title">{title || "Untitled"}</p>
          <p className="entry-cover-date small-text">{date}</p>
        </div>
      </button>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default EntryCover;