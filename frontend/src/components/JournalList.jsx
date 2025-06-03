import React from 'react';
import EntryCover from './EntryCover';
import { useUser } from '../context/UserContext';
import '../styles/JournalList.css';

function JournalList() {
  const { journals, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  console.log(journals);

  return (
    <div className='journal-list'>
      {journals.map((entry) => (
        <EntryCover
          key={entry.id}
          id={entry.id}
          title={entry.title}
          date={entry.date}
          mood={entry.moodStats?.dominantMood || 'Happy'}
        />
      ))}
    </div>
  );
}

export default JournalList;