// Main.jsx
import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const Main = () => {
  const { theme } = useContext(ThemeContext); // Access the current theme

  return (
    <main
      style={{
        background: theme === "light" ? "#fff" : "#121212",
        color: theme === "light" ? "#000" : "#fff",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2>The current theme is {theme} mode</h2>
    </main>
  );
};

export default Main;
