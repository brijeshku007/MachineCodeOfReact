import React, { createContext, useContext, useState } from 'react';

/**
 * Theme Context - Example Context for useContext learning
 * 
 * This demonstrates:
 * 1. Creating a context
 * 2. Providing context value
 * 3. Consuming context with useContext
 */

// 1. CREATE CONTEXT
export const ThemeContext = createContext();

// 2. CREATE PROVIDER COMPONENT
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('en');

  // Theme configurations
  const themes = {
    light: {
      backgroundColor: '#ffffff',
      color: '#333333',
      borderColor: '#dddddd'
    },
    dark: {
      backgroundColor: '#2d3748',
      color: '#ffffff',
      borderColor: '#4a5568'
    },
    blue: {
      backgroundColor: '#ebf8ff',
      color: '#2b6cb0',
      borderColor: '#90cdf4'
    }
  };

  const fontSizes = {
    small: '14px',
    medium: '16px',
    large: '18px',
    xlarge: '20px'
  };

  const toggleTheme = () => {
    const themeOrder = ['light', 'dark', 'blue'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const updateFontSize = (size) => {
    setFontSize(size);
  };

  const updateLanguage = (lang) => {
    setLanguage(lang);
  };

  // Context value object
  const contextValue = {
    // State
    theme,
    fontSize,
    language,
    
    // Computed values
    currentTheme: themes[theme],
    currentFontSize: fontSizes[fontSize],
    
    // Actions
    toggleTheme,
    updateFontSize,
    updateLanguage,
    
    // Available options
    availableThemes: Object.keys(themes),
    availableFontSizes: Object.keys(fontSizes),
    availableLanguages: ['en', 'es', 'fr', 'de']
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. CUSTOM HOOK FOR CONSUMING CONTEXT
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};