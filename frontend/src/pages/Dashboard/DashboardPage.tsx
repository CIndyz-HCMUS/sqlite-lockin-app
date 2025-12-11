// src/pages/Dashboard/DashboardPage.tsx
import React from "react";
import { loadAuth, clearAuth } from "../../utils/authStorage";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = loadAuth();

  const handleLogout = () => {
    clearAuth();
    navigate("/signin", { replace: true });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {auth?.user?.first_name || auth?.user?.email}</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default DashboardPage;
