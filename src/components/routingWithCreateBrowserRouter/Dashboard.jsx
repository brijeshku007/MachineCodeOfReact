import { Outlet } from "react-router-dom"; // Outlet renders nested routes

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <Outlet /> {/* Nested routes will be rendered here */}
    </div>
  );
};

export default Dashboard;
