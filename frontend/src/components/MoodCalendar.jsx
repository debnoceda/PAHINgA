import React, { useMemo } from 'react';
import Calendar from 'react-calendar';
import { Icon } from '@iconify/react';
import 'react-calendar/dist/Calendar.css';
import '../styles/MoodCalendar.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const MoodCalendar = () => {
  const navigate = useNavigate();
  const { journals } = useUser();

  const moodData = useMemo(() => {
    return journals.reduce((acc, journal) => {
      const date = new Date(journal.date).toLocaleDateString('en-CA');
      const mood = journal.moodStats?.dominantMood?.toLowerCase() || 'neutral';
      if (mood) {
        acc[date] = mood;
      }
      return acc;
    }, {});
  }, [journals]);

  // console.log('Mood data:', moodData); // Debugging line to check moodData structure

  const handleDateClick = (date) => {
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }); // Format: "June 5, 2025"
    navigate(`/journal?date=${encodeURIComponent(formattedDate)}`);
  };

  return (
    <Calendar
      calendarType="gregory"
      prevLabel={<Icon icon="lucide:circle-chevron-left" width="24" height="24" />}
      nextLabel={<Icon icon="lucide:circle-chevron-right" width="24" height="24" />}
      showNeighboringMonth={false}
      onClickDay={handleDateClick}
      tileClassName={({ date, view }) => {
        const key = date.toLocaleDateString('en-CA');
        let mood = null;

        if (Object.prototype.hasOwnProperty.call(moodData, key)) {
          // Journal exists for this date
          mood = moodData[key] ? moodData[key].toLowerCase() : 'neutral';
        }

        const isFuture = date > new Date();
        const isPast = view === 'month' && date < new Date();
        const dayOfWeek = date.getDay();

        let classes = ['calendar-tile'];
        classes.push(`weekday-${dayOfWeek}`);
        if (view === 'month' && mood) classes.push(`mood-${mood}`);
        if (isFuture) classes.push('react-calendar__tile--future');
        if (isPast) classes.push('react-calendar__tile--past');

        return classes.join(' ');
      }}
    />
  );
};

export default MoodCalendar;