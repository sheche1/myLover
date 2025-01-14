import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/LoginPage.css';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                onLogin(data.token); // Pasa el token al componente padre
            } else {
                setErrorMessage('Credenciales incorrectas, por favor intente nuevamente.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setErrorMessage('Error de conexión, intente más tarde.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Iniciar Sesión</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {/* Agrega el botón para navegar al registro */}
                <p className="navigate-to-register">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="register-link">Crear una cuenta</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
