import React, { useState } from 'react';

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div
      style={{
        background: isDarkMode ? '#333' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</h1>
      <button onClick={() => setIsDarkMode(!isDarkMode)}>
        Toggle Theme
      </button>
    </div>
  );
}

export default ThemeToggle;
