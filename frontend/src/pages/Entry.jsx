import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import api from '../api';

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

  return (
    <div>
      <NavigationBar />
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
          placeholder="This is the content of entry."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={8}
        />
      </div>
      <button onClick={handleSave}>
        {isNew ? 'Create Entry' : 'Save Changes'}
      </button>
    </div>
  );
}

export default Entry;
