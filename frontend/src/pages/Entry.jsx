import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import PieChart from '../components/PieChart';
import api from '../api';
import { useUser } from '../context/UserContext';
import '../styles/Entry.css';
import Pet from '../components/Pet';
import toast, { Toaster } from 'react-hot-toast';

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
  const [pieChartRefreshKey, setPieChartRefreshKey] = useState(0);
  const createTimeout = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  const defaultMessages = [
    "Click me to evaluate your mood.",
    "How are you feeling? Click to find out..",
    "Tap me and see what happens.",
    "Click me to explore your current mood.",
    "Ready to explore your mood?",
    "Mood mystery? Click me to solve it!",
    "Ready to reflect on your mood? Click now.",

  ];

  const [currentDefaultMessageIndex, setCurrentDefaultMessageIndex] = useState(() => {
    return Math.floor(Math.random() * defaultMessages.length);
  });

  // Add useEffect for default message rotation
  useEffect(() => {
    if (adviceMessages.length > 0) return; // Don't rotate if we have advice messages

    const interval = setInterval(() => {
      setCurrentDefaultMessageIndex((prevIndex) => (prevIndex + 1) % defaultMessages.length);
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [adviceMessages]);

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

    // Reset analysis when content changes (after initial load)
    if (loaded && (moodStats || adviceMessages.length > 0)) {
      setMoodStats(null);
      setAdviceMessages([]);
      setCurrentAdviceIndex(0);
    }

    // If new entry and enough content, debounce creation
    if (isNew && !hasCreated.current && ((title && title.length >= 3) || (text && text.length >= 5))) {
      if (createTimeout.current) clearTimeout(createTimeout.current);
      createTimeout.current = setTimeout(() => {
        addEntry();
      }, 500); // 1 second debounce
      return () => clearTimeout(createTimeout.current);
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
    setIsSaving(true);
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
      toast.error('Failed to create entry');
    } finally {
      setIsSaving(false);
    }
  };

  const updateEntry = async (updateId) => {
    setIsSaving(true);
    try {
      await api.put(`/journals/${updateId}/`, {
        title,
        date,
        content: text,
      });
      // alert('Entry updated!');
    } catch (err) {
      toast.error('Failed to update entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoBack = async () => {
    // If saving is in progress or a timeout is pending, wait for save
    if (isSaving || createTimeout.current) {
      toast('Please wait, saving your changes...');
      // Wait for the save to finish, then go back
      const waitForSave = () =>
        new Promise(resolve => {
          const check = () => {
            if (!isSaving && !createTimeout.current) resolve();
            else setTimeout(check, 100);
          };
          check();
        });
      await waitForSave();
    }

    // For new entries, save before going back if not yet saved
    if (
      isNew &&
      !hasCreated.current &&
      ((title && title.length >= 3) || (text && text.length >= 5))
    ) {
      if (createTimeout.current) clearTimeout(createTimeout.current);
      try {
        await addEntry();
        navigate(-1);
      } catch (err) {
        toast.error('Failed to save before going back.');
      }
      return;
    }

    // For existing entries, update before going back if there are unsaved changes
    if (
      entryId &&
      !isSaving &&
      ((title && title.length >= 3) || (text && text.length >= 5))
    ) {
      if (createTimeout.current) clearTimeout(createTimeout.current);
      try {
        await updateEntry(entryId);
        navigate(-1);
      } catch (err) {
        toast.error('Failed to update before going back.');
      }
      return;
    }

    // Otherwise, just go back
    navigate(-1);
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
  
      toast.success('Pet analyzed your mood and generated insights!');
      setPieChartRefreshKey((k) => k + 1); // Refresh PieChart
    } catch (error) {
      console.error('Error processing emotions:', error);
      toast.error('Failed to analyze pet mood. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePetClick = () => {
    if (isAnalyzing) return;
    
    // If there are advice messages, cycle through them
    if (adviceMessages.length > 0) {
      handleAdviceClick();
    } else {
      // Otherwise, start analysis
      handlePetAnalysis();
    }
  };

  // Get emotion code for dominant mood
  const getDominantEmotionCode = () => {
    if (!moodStats || !moodStats.dominantMood) return 0; // default to neutral for no analysis
    return moodToEmotionCode[moodStats.dominantMood.toLowerCase()] || 0;
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

  useEffect(() => {
    return () => {
      if (createTimeout.current) clearTimeout(createTimeout.current);
    };
  }, []);

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
              {/* Title */}
              {!loaded ? (
                <div className="entry-skeleton-title" />
              ) : (
                <input
                  className="entry-title"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={!loaded}
                />
              )}

              {/* Date */}
              {!loaded ? (
                <div className="entry-skeleton-date" />
              ) : (
                <div className="entry-date small-text">
                  {formatDate(date)}
                </div>
              )}
            </div>
            <div className="entry-content">
              {/* Text */}
              {!loaded ? (
                <div className="entry-skeleton-text" />
              ) : (
                <textarea
                  className="entry-text"
                  placeholder="Write your thoughts here..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={20}
                  disabled={!loaded}
                />
              )}
            </div>
          </div>

          {/* Second Column - 2 Rows for Pie Charts */}
          <div className="charts-section">
            <div className="chart-container">
              <div 
                className="entry-pet"
                onClick={handlePetClick}
                style={{ 
                  cursor: isAnalyzing ? 'default' : 'pointer',
                  opacity: isAnalyzing ? 0.7 : 1,
                  pointerEvents: isAnalyzing ? 'none' : 'auto'
                }}
              >
                <Pet 
                  emotionCode={getDominantEmotionCode()} 
                  showDialog={true}
                  message={
                    isAnalyzing 
                      ? "Thinking..."
                      : adviceMessages.length > 0 
                        ? adviceMessages[currentAdviceIndex]
                        : defaultMessages[currentDefaultMessageIndex]
                  }
                  className="entry-pet-container"
                  dialogClassName="entry-dialog-box"
                />
              </div>
            </div>
            <div className="chart-container">
              <PieChart entryId={entryId} refreshKey={pieChartRefreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Entry;
