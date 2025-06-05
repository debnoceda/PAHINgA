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

function JournalList({ search = '', mood = '', date = null, limit }) {
  const { journals, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  const searchLower = search.toLowerCase();

  // Filter by title, content, date (raw or formatted), or dominant mood
  let filteredJournals = journals.filter(entry => {
    const formattedDate = formatDate(entry.date).toLowerCase();
    const matchesSearch =
      (entry.title?.toLowerCase().includes(searchLower)) ||
      (entry.content?.toLowerCase().includes(searchLower)) ||
      (entry.date?.toLowerCase().includes(searchLower)) ||
      (formattedDate.includes(searchLower)) ||
      (entry.moodStats?.dominantMood?.toLowerCase().includes(searchLower));

    // Mood filter
    const matchesMood = !mood || (entry.moodStats?.dominantMood?.toLowerCase() === mood);

    // Date filter (compare formatted date string)
    const matchesDate = !date || formatDate(entry.date) === formatDate(date);

    return matchesSearch && matchesMood && matchesDate;
  });

  // Sort by date (most recent first) and apply limit if provided
  filteredJournals = filteredJournals.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (limit) {
    filteredJournals = filteredJournals.slice(0, limit);
  }

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