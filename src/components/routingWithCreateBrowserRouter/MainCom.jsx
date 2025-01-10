import React from "react";
import { Link, Outlet } from "react-router-dom";
const ID=Math.random()+10;
const MainCom = () => {

  return (
    <div>
      <nav>
         <Link to="/">Home</Link> | 
         <Link to="/about">About</Link> | 
         <Link to="/dashboard">Dashboard</Link>
         <Link to="/dashboard/settings">Setting</Link>
         <Link to={`/user/${ID}`}>User</Link>
      </nav>
      <hr />
      {/* Render child routes */}
      <Outlet />
    </div>
  );
};

export default MainCom;
