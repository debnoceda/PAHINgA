import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import '../styles/FloatingActionButton.css';

const FloatingActionButton = () => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    // Add your custom functionality here
    console.log('Floating Action Button toggled:', !isActive);
  };

  return (
    <button
      className={`floating-action-button ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <Icon icon="solar:pen-new-square-bold" className="fab-icon" />
    </button>
  );
};

export default FloatingActionButton;