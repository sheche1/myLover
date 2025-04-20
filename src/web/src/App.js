import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CalendarPage from './components/CalendarPage';
import ProfilePage from './components/ProfilePage';
import FriendsPage from './components/FriendsPage';
import SendLetterPage from './components/SendLetterPage';
import ReceivedLettersPage from './components/ReceivedLettersPage';
import ImportantEventList from './components/ImportantEventList';
import PhotoGallery from './components/PhotoGallery';
import UploadPhoto from './components/UploadPhoto';
import GoalsPage from './components/GoalsPage';
import MemoryMapPage from './components/MemoryMapPage';


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

        <Route
          path="/"
          element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

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
        
        <Route
          path="/gallery"
          element={isAuthenticated ? <PhotoGallery /> : <Navigate to="/login" />}
        />
        <Route
          path="/upload-photo"
          element={isAuthenticated ? <UploadPhoto /> : <Navigate to="/login" />}
        />

        <Route
          path="/important-events"
          element={isAuthenticated ? <ImportantEventList /> : <Navigate to="/login" />}
        />

        <Route 
          path="/goals" 
          element={isAuthenticated ? <GoalsPage /> : <Navigate to="/login" />}
         />

        <Route
          path="/memory-map"
          element={isAuthenticated ? <MemoryMapPage /> : <Navigate to="/login" />}
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
