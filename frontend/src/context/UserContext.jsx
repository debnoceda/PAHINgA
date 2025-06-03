import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api'; // Import your configured Axios instance

const UserContext = createContext();

export function UserProvider({ children }) {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/journals/')
      .then(res => {
        setJournals(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ journals, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}