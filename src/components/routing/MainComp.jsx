import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Dashboard from "./Dashboard";
import User from "./User";
import NotFound from "./NotFound";

const MainCompo = () => {
  const navigate = useNavigate(); // Hook for navigation
const ID=Math.random()+10;
  return (
    <div>
      {/* Basic Navigation Menu */}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/dashboard/settings">Setting</Link>
        <Link to={`/user/${ID}`}>User</Link>
        <button onClick={() => navigate("/about")}>Go to About</button>
      </nav>

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<User />} /> {/* Dynamic Route */}
        
        {/* Nested Routes for Dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="settings" element={<h2>User Settings</h2>} /> {/* Nested Route */}
        </Route>

        {/* Catch-all Route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default MainCompo;
