// src/components/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a Context for theme management
const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  // Set dark mode to default 'dark' theme
  const [darkMode, setDarkMode] = useState('dark');

  // Toggle dark mode
  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      const newMode = prevMode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('darkMode', newMode); // Save theme preference in localStorage
      return newMode;
    });
  };

  // Ensure the body class updates according to the theme
  useEffect(() => {
    if (darkMode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
