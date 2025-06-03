import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api'; // Import your configured Axios instance

const UserContext = createContext();

export function UserProvider({ children }) {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Separate fetchJournals function
  const fetchJournals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/journals/');
      setJournals(res.data);
    } catch {
      setJournals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add deleteEntry here
  const deleteEntry = useCallback(async (deleteId) => {
    try {
      await api.delete(`/journals/${deleteId}/`);
      // Optionally update local state
      setJournals(prev => prev.filter(j => j.id !== deleteId));
    } catch (err) {
      // Optionally handle error
    }
  }, []);

  return (
    <UserContext.Provider value={{ journals, loading, fetchJournals, deleteEntry }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}