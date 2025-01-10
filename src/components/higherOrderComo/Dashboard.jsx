// What is a Higher-Order Component?
// A Higher-Order Component (HOC) is like a "wrapper" that takes an existing component, adds some extra functionality to it, and then gives back a new component. Think of it like wrapping a gift. The gift inside (the original component) doesn't change, but the wrapping (extra functionality) makes it look better or behave differently.

// Real-Time Example: Authentication Check
// Imagine you’re building a dashboard in an application, but only authenticated users should be able to access it. If a user is not logged in, they should be redirected to the login page.

// Here’s how an HOC can help handle this logic.



const Dashboard = () => {
  return <h1>Welcome to your Dashboard!</h1>;
};

export default Dashboard;
