import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api'; // Import your configured Axios instance
import { ACCESS_TOKEN } from '../constants';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setUser(null);
        return;
      }

      const response = await api.get('/users/me/');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    }
  }, []);

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Listen for token changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === ACCESS_TOKEN) {
        if (e.newValue) {
          fetchUserData();
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchUserData]);

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

  const value = {
    user,
    journals,
    loading,
    fetchUserData,
    fetchJournals,
    deleteEntry
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};