import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import PieChart from '../components/PieChart';
import api from '../api';
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

function Entry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [text, setText] = useState('');

  // Fetch existing entry if not new
  useEffect(() => {
    if (!isNew) {
      api.get(`/journals/${id}/`)
        .then(res => {
          setTitle(res.data.title || '');
          setDate(res.data.date || '');
          setText(res.data.content || '');
        });
    } else {
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [id, isNew]);

  const addEntry = async () => {
    try {
      const res = await api.post('/journals/', {
        title,
        date,
        content: text,
      });
      navigate(`/entry/${res.data.id}`);
    } catch (err) {
      alert('Failed to create entry');
    }
  };

  const updateEntry = async () => {
    try {
      await api.put(`/journals/${id}/`, {
        title,
        date,
        content: text,
      });
      alert('Entry updated!');
    } catch (err) {
      alert('Failed to update entry');
    }
  };

  const handleSave = async () => {
    if (isNew) {
      await addEntry();
    } else {
      await updateEntry();
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
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
              <input
                className="entry-date small-text"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
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
              <h3>Pet</h3>
              {/* <PieChart width={300} height={300} data={sampleData} emotionCode={1}/> */}
            </div>
            <div className="chart-container">
              <p>Mood Overview</p>
              <PieChart width={200} height={200} data={sampleData2} emotionCode={4}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Entry;
