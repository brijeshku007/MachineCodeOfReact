import React from "react";
import { useNavigate } from "react-router-dom";
// localStorage.setItem("authToken", "yourTokenHere");

const withAuth = (WrappedComponent) => {
  return (props) => {
    // const navigate = useNavigate(); // For redirection
    const isAuthenticated = localStorage.getItem("authToken"); // Check if token exists

    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      // navigate("/login");
      return <>you are not authrize</>; // Do not render anything
    }

    // If authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
