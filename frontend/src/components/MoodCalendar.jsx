import React from 'react';
import Calendar from 'react-calendar';
import { Icon } from '@iconify/react';
import 'react-calendar/dist/Calendar.css';
import '../styles/MoodCalendar.css';

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
        // Format date to match the moodData keys format (YYYY-MM-DD)
        const key = date.toLocaleDateString('en-CA'); // This formats as YYYY-MM-DD
        const mood = moodData?.[key];
        const isFuture = date > new Date();
        const isPast = view === 'month' && date < new Date() && !mood;
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