import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const setAuthData = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
    const expirationDate = new Date(new Date().getTime() + 3 * 30 * 24 * 60 * 60 * 1000);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  };

  const clearAuthData = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const expirationDate = new Date(localStorage.getItem('expirationDate'));

    if (storedToken && expirationDate > new Date()) {
      setToken(storedToken);
    } else {
      clearAuthData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
