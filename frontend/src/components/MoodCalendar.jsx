import React from 'react';
import Calendar from 'react-calendar';
import { Icon } from '@iconify/react';
import 'react-calendar/dist/Calendar.css';
import '../styles/MoodCalendar.css';

// Import your PNG images
import happyImg from '../assets/CalendarEmoji/CalendarHappy.png';
import sadImg from '../assets/CalendarEmoji/CalendarSad.png';
import angryImg from '../assets/CalendarEmoji/CalendarAngry.png';
import fearImg from '../assets/CalendarEmoji/CalendarFear.png';
import disgustImg from '../assets/CalendarEmoji/CalendarDisgust.png';

const moodIcons = {
  happy: happyImg,
  sad: sadImg,
  angry: angryImg,
  fear: fearImg,
  disgust: disgustImg,
  default: happyImg,
};

const MoodCalendar = ({ moodData = {} }) => {
  return (
    <Calendar
      calendarType="gregory"
      prevLabel={<Icon icon="lucide:circle-chevron-left" width="24" height="24" />}
      nextLabel={<Icon icon="lucide:circle-chevron-right" width="24" height="24" />}
      showNeighboringMonth={false}
      tileClassName={({ date, view }) => {
        const key = date.toISOString().split('T')[0];
        const mood = moodData?.[key];
        const isFuture = date > new Date();
        const isPast = date < new Date() && !mood;  // Add this line
        
        let classes = ['calendar-tile'];
        if (view === 'month' && mood) classes.push(`mood-${mood}`);
        if (isFuture) classes.push('react-calendar__tile--future');
        if (isPast) classes.push('react-calendar__tile--past');  // Add this line
        
        return classes.join(' ');
      }}
    />
  );
};

export default MoodCalendar;