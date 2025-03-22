import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importa tus páginas existentes
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CalendarPage from './components/CalendarPage';
import ProfilePage from './components/ProfilePage';
import FriendsPage from './components/FriendsPage';
import SendLetterPage from './components/SendLetterPage';
import ReceivedLettersPage from './components/ReceivedLettersPage';

// Importa la galería y la página de subir foto
import PhotoGallery from './components/PhotoGallery';
import UploadPhoto from './components/UploadPhoto';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Rutas de autenticación */}
        <Route 
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route 
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
        />

        {/* Home protegida (si no autenticado → /login) */}
        <Route
          path="/"
          element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        {/* Otras páginas protegidas */}
        <Route
          path="/calendar"
          element={isAuthenticated ? <CalendarPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/friends"
          element={isAuthenticated ? <FriendsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/send-letter"
          element={isAuthenticated ? <SendLetterPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/received-letters"
          element={isAuthenticated ? <ReceivedLettersPage /> : <Navigate to="/login" />}
        />

        {/* NUEVAS rutas para la galería de fotos */}
        <Route
          path="/gallery"
          element={isAuthenticated ? <PhotoGallery /> : <Navigate to="/login" />}
        />
        <Route
          path="/upload-photo"
          element={isAuthenticated ? <UploadPhoto /> : <Navigate to="/login" />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={<h1 style={{ textAlign: 'center' }}>404 - Página no encontrada</h1>}
        />
      </Routes>
    </Router>
  );
}

export default App;
