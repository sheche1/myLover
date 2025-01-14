import React, { useState } from 'react';
import './css/RegisterPage.css'; 

function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message || 'Algo salió mal'}`);
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            setMessage('Error al conectar con el servidor.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Registro</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="register-button">Registrar</button>
                </form>
                {message && <p className="register-message">{message}</p>}
                <p className="navigate-to-login">
                    ¿Ya tienes una cuenta? <a href="/login" className="login-link">Inicia sesión</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
