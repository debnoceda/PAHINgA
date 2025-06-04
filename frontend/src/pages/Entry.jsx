import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import PieChart from '../components/PieChart';
import api from '../api';
import { useUser } from '../context/UserContext';
import '../styles/Entry.css';

const sampleData = [
  { name: 'Happiness', value: 90 },
  { name: 'Anger', value: 12 },
  { name: 'Fear', value: 34 },
  { name: 'Disgust', value: 53 },
  { name: 'Sadness', value: 98 },
];

const sampleData2 = [
  { name: 'Happiness', value: 45 },
  { name: 'Anger', value: 25 },
  { name: 'Fear', value: 15 },
  { name: 'Disgust', value: 10 },
  { name: 'Sadness', value: 5 },
];

const moodToEmotionCode = {
  anger: 1,
  disgust: 2,
  fear: 3,
  happy: 4,
  sad: 5,
};

function Entry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [text, setText] = useState('');
  const [entryId, setEntryId] = useState(isNew ? null : id);
  const [loaded, setLoaded] = useState(false);
  const [moodStats, setMoodStats] = useState(null);
  const [adviceMessages, setAdviceMessages] = useState([]);
  const [currentAdviceIndex, setCurrentAdviceIndex] = useState(0);
  const hasCreated = useRef(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { deleteEntry } = useUser();

  // Add useEffect for advice rotation
  useEffect(() => {
    if (adviceMessages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdviceIndex((prevIndex) => (prevIndex + 1) % adviceMessages.length);
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [adviceMessages]);

  const handleAdviceClick = () => {
    if (adviceMessages.length <= 1) return;
    setCurrentAdviceIndex((prevIndex) => (prevIndex + 1) % adviceMessages.length);
  };

  // Fetch journal if editing
  const fetchJournal = async (journalId) => {
    try {
      const res = await api.get(`/journals/${journalId}/`);
      setTitle(res.data.title || '');
      setDate(res.data.date || '');
      setText(res.data.content || '');
      setMoodStats(res.data.moodStats || null);
      setAdviceMessages(res.data.insights?.advice_messages || []);
      setLoaded(true); // Mark as loaded after fetch
    } catch (err) {
      setTitle('');
      setDate('');
      setText('');
      setMoodStats(null);
      setAdviceMessages([]);
      setLoaded(true); // Even if error, mark as loaded
    }
  };

  useEffect(() => {
    if (!isNew) {
      fetchJournal(id);
      setEntryId(id);
    } else {
      setDate(new Date().toISOString().slice(0, 10));
      setEntryId(null);
      setLoaded(true); // For new, mark as loaded immediately
    }
    hasCreated.current = false;
    // eslint-disable-next-line
  }, [id, isNew]);

  // Auto-save and auto-delete logic
  useEffect(() => {
    // Only auto-delete if loaded
    if (loaded && entryId && !title && !text) {
      deleteEntry(entryId);
      return;
    }

    // If new entry and either field is filled, auto-create
    if (isNew && !hasCreated.current && (title || text)) {
      addEntry();
      return;
    }

    // If editing existing entry and either field changes, auto-update
    if (entryId && (title || text)) {
      const timeout = setTimeout(() => {
        updateEntry(entryId);
      }, 500); // debounce to avoid too many requests
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [title, text, date, entryId, isNew, loaded]);

  const addEntry = async () => {
    try {
      const res = await api.post('/journals/', {
        title,
        date,
        content: text,
      });
      hasCreated.current = true;
      setEntryId(res.data.id);
      navigate(`/entry/${res.data.id}`, { replace: true });
    } catch (err) {
      alert('Failed to create entry');
    }
  };

  const updateEntry = async (updateId) => {
    try {
      await api.put(`/journals/${updateId}/`, {
        title,
        date,
        content: text,
      });
      // alert('Entry updated!');
    } catch (err) {
      alert('Failed to update entry');
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handlePetAnalysis = async () => {
    if (!entryId || isAnalyzing) return;
  
    setIsAnalyzing(true);
    try {
      console.log('Processing emotions for entry:', entryId);
      const response = await api.post(`/journals/${entryId}/process_emotions/`);
      console.log('Processed emotions:', response.data);
      
      setMoodStats(response.data.moodStats);
      setAdviceMessages(response.data.insights?.advice_messages || []);
      setCurrentAdviceIndex(0); // Reset to first message
  
      alert('Pet analyzed your mood and generated insights!');
    } catch (error) {
      console.error('Error processing emotions:', error);
      alert('Failed to analyze pet mood. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Convert mood stats to chart data format
  const getChartData = () => {
    if (!moodStats) return sampleData2; // Fallback to sample data if no mood stats

    return [
      { name: 'Happiness', value: moodStats.percentHappiness },
      { name: 'Anger', value: moodStats.percentAnger },
      { name: 'Fear', value: moodStats.percentFear },
      { name: 'Disgust', value: moodStats.percentDisgust },
      { name: 'Sadness', value: moodStats.percentSadness },
    ];
  };

  // Get emotion code for dominant mood
  const getDominantEmotionCode = () => {
    if (!moodStats || !moodStats.dominantMood) return 4; // default to happy
    return moodToEmotionCode[moodStats.dominantMood.toLowerCase()] || 4;
  };

  // Format date to "June 4, 2025" format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="entry-container">
        {/* Main Grid Layout */}
        <div className="entry-grid">
          {/* Back Button */}
          <button className="back-button" onClick={handleGoBack}>
            <Icon icon="gg:chevron-right-o" width="80" height="80" />
          </button>

          {/* First Column - Dotted Paper Style */}
          <div className="dotted-paper-section">
            <div className="entry-header">
              <input
                className="entry-title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <div className="entry-date small-text">
                {formatDate(date)}
              </div>
            </div>
            <div className="entry-content">
              <textarea
                className="entry-text"
                placeholder="Write your thoughts here..."
                value={text}
                onChange={e => setText(e.target.value)}
                rows={20}
              />
            </div>
            {/* <button className="save-button" onClick={handleSave}>
              {isNew ? 'Create Entry' : 'Save Changes'}
            </button> */}
          </div>

          {/* Second Column - 2 Rows for Pie Charts */}
          <div className="charts-section">
            <div className="chart-container">
              <button 
                onClick={handlePetAnalysis}
                disabled={isAnalyzing}
              >
                <h3>{isAnalyzing ? 'Analyzing...' : 'Pet'}</h3>
              </button>
              {adviceMessages.length > 0 && (
                <div 
                  className="advice-message" 
                  onClick={handleAdviceClick}
                  style={{ cursor: adviceMessages.length > 1 ? 'pointer' : 'default' }}
                >
                  <p>{adviceMessages[currentAdviceIndex]}</p>
                  {adviceMessages.length > 1 && (
                    <small className="advice-hint">Click to see next advice</small>
                  )}
                </div>
              )}
            </div>
            <div className="chart-container">
              {moodStats && (
                <PieChart data={getChartData()} emotionCode={getDominantEmotionCode()}/>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Entry;
