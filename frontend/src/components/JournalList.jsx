import React from 'react';
import EntryCover from './EntryCover';
import { useUser } from '../context/UserContext';
import '../styles/JournalList.css';

// Helper to format date as "Month Day, Year"
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function JournalList({ search = '' }) {
  const { journals, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  const searchLower = search.toLowerCase();

  // Filter by title, content, date (raw or formatted), or dominant mood
  const filteredJournals = journals.filter(entry => {
    const formattedDate = formatDate(entry.date).toLowerCase();
    return (
      (entry.title?.toLowerCase().includes(searchLower)) ||
      (entry.content?.toLowerCase().includes(searchLower)) ||
      (entry.date?.toLowerCase().includes(searchLower)) ||
      (formattedDate.includes(searchLower)) ||
      (entry.moodStats?.dominantMood?.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className='journal-list'>
      {filteredJournals.length === 0 ? (
        <p className="no-entries-found small-text">No entries found.</p>
      ) : (
        filteredJournals.map((entry) => (
          <EntryCover
            key={entry.id}
            id={entry.id}
            title={entry.title}
            date={entry.date}
            mood={entry.moodStats?.dominantMood || 'Happy'}
          />
        ))
      )}
    </div>
  );
}

export default JournalList;