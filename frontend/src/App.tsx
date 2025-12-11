// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/Auth/SignInPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import GetStartedPage from "./pages/Auth/GetStartedPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/getting-started" element={<GetStartedPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
