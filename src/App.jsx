import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './LoginPage';
import WelcomePage from './WelcomePage';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    // Navigation to /welcome is handled inside LoginPage via useNavigate
  };

  const handleLogout = () => {
    setUser(null);
    // Navigation to /login is handled inside WelcomePage via useNavigate
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ Login — navigates to /welcome on success */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/welcome" replace />
              : <LoginPage onLogin={handleLogin} />
          }
        />

        {/* ✅ Welcome — shown after login, before entering system */}
        <Route
          path="/welcome"
          element={
            user
              ? <WelcomePage user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />

        {/* ✅ Protected main system */}
        <Route
          path="/:mId/*"
          element={
            user
              ? <MainLayout />
              : <Navigate to="/login" replace />
          }
        />

        {/* ✅ Default redirect */}
        <Route
          path="*"
          element={
            <Navigate
              to={user ? "/welcome" : "/login"}
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
