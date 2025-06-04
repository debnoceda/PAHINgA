import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api'; // Import your configured Axios instance
import { ACCESS_TOKEN } from '../constants';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  //Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      console.log('Fetching user data...');
      const token = localStorage.getItem(ACCESS_TOKEN);
      console.log('Access token:', token ? 'Present' : 'Missing');
      
      const res = await api.get('/users/me/');
      console.log('User data response:', res.data);
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers
      });
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user data when component mounts
  useEffect(() => {
    console.log('UserProvider mounted, fetching user data...');
    fetchUserData();
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

  return (
    <UserContext.Provider value={{ user, journals, loading, fetchUserData, fetchJournals, deleteEntry }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}