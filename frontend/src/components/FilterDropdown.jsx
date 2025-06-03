import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import '../styles/FilterDropdown.css';

const FilterDropdown = ({ isOpen, onClose, onFilterChange }) => {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [dateSort, setDateSort] = useState('newest'); // 'newest' or 'oldest'

  if (!isOpen) return null;

  const handleMoodToggle = (mood) => {
    setSelectedMoods(prev => {
      const newMoods = prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood];
      onFilterChange({ moods: newMoods, dateSort });
      return newMoods;
    });
  };

  const handleDateSort = () => {
    const newSort = dateSort === 'newest' ? 'oldest' : 'newest';
    setDateSort(newSort);
    onFilterChange({ moods: selectedMoods, dateSort: newSort });
  };

  const handleReset = () => {
    setSelectedMoods([]);
    setDateSort('newest');
    onFilterChange({ moods: [], dateSort: 'newest' });
    onClose();
  };

  return (
    <div className="filter-dropdown">
      <div className="filter-section">
        <button className="filter-item" onClick={handleDateSort}>
          <Icon 
            icon={dateSort === 'newest' 
              ? "mdi:sort-calendar-descending" 
              : "mdi:sort-calendar-ascending"} 
            className="filter-icon" 
          />
          Sort by Date ({dateSort})
        </button>
      </div>

      <div className="filter-divider"></div>

      <div className="filter-section">
        <div className="filter-section-title">Filter by Mood</div>
        <div className="mood-checkboxes">
          {['Happy', 'Sad', 'Anger', 'Fear', 'Disgust'].map(mood => (
            <label key={mood} className="mood-checkbox">
              <input
                type="checkbox"
                checked={selectedMoods.includes(mood)}
                onChange={() => handleMoodToggle(mood)}
              />
              <Icon 
                icon={`mdi:emoticon${mood.toLowerCase()}`} 
                className="mood-icon"
              />
              {mood}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-divider"></div>

      <button className="filter-item" onClick={handleReset}>
        <Icon icon="mdi:refresh" className="filter-icon" />
        Reset Filters
      </button>
    </div>
  );
};

export default FilterDropdown;