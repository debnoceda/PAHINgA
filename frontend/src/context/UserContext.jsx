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

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  return (
    <UserContext.Provider value={{ journals, loading, fetchJournals }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}