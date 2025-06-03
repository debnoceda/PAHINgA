import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import '../styles/FloatingActionButton.css';

const FloatingActionButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/entry/new');
  };

  return (
    <button
      className="floating-action-button"
      onClick={handleClick}
    >
      <Icon icon="solar:pen-new-square-bold" className="fab-icon" />
    </button>
  );
};

export default FloatingActionButton;