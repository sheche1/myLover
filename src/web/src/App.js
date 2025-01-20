import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CalendarPage from './components/CalendarPage';
import ProfilePage from './components/ProfilePage';

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
                {/* Nueva ruta para el perfil */}
                <Route
                    path="/profile"
                    element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
                />
                {/* Ruta por defecto 404 */}
                <Route 
                    path="*" 
                    element={<h1 style={{ textAlign: 'center' }}>404 - Página no encontrada</h1>} 
                />
            </Routes>
        </Router>
    );
}

export default App;
