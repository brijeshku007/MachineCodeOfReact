import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import User from "./User";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import NotFound from "./NotFound";
import MainCom from "./MainCom"; // Import MainCom

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainCom />, // MainCom as the parent layout
    children: [
      {
        path: "/", // Home route
        element: <Home />,
      },
      {
        path: "about", // About route
        element: <About />,
      },
      {
        path: "user/:id", // Dynamic Route
        element: <User />,
      },
      {
        path: "dashboard", // Parent route for nested routes
        element: <Dashboard />,
        children: [
          {
            path: "settings", // Nested Route inside Dashboard
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: "*", // Catch-all route for 404
    element: <NotFound />,
  },
]);

export default router;
