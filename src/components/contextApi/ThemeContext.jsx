// The Context API in React provides a way to share global state across components without passing props manually through every level of the component tree. It’s particularly useful for managing data like theme, authentication status, or user settings in your application.



// ThemeContext.jsx
import React, { createContext, useState } from "react";

// Create Context
export const ThemeContext = createContext();

// Create a Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Global state: theme

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light")); // Toggle between light and dark
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
