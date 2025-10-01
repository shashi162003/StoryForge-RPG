import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useStore from './store/useStore';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import LobbyPage from './pages/LobbyPage';
import RoomPage from './pages/RoomPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';

import { useSocket } from './hooks/useSocket';

import axios from 'axios';

import { useState, useEffect } from 'react';

const ProtectedRoute = () => {
  const { user } = useStore();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  useSocket();
  const { setUser } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          { withCredentials: true }
        );
        setUser(data.user);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, [setUser]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark text-4xl">Loading...</div>;
  }


  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LobbyPage />} />
          <Route path="room/:roomCode" element={<RoomPage />} />
        </Route>
      </Route>

      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-otp" element={<VerifyOtpPage />} />
      </Route>
    </Routes>
  );
}

export default App;