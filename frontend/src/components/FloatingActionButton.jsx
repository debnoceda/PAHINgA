import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useUser } from '../context/UserContext';
import '../styles/FloatingActionButton.css';

const FloatingActionButton = () => {
  const navigate = useNavigate();
  const { journals } = useUser();

  const handleClick = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toLocaleDateString('en-CA');

    // Find journal entry for today
    const todayEntry = journals.find(journal =>
      journal.date.split('T')[0] === today
    );

    if (todayEntry) {
      // Navigate to existing entry if found
      navigate(`/entry/${todayEntry.id}`);
    } else {
      // Navigate to new entry form if no entry exists
      navigate('/entry/new');
    }
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