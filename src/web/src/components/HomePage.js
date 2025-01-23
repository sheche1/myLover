import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación

function HomePage({ onLogout }) {
    const navigate = useNavigate(); // Hook para navegar entre rutas

    // Estilos en línea para el fondo
    const backgroundStyle = {
        backgroundImage: 'url(/imagenes/background.jpg)', // Ruta absoluta desde public
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    };

    // Estilos en línea para la caja de contenido
    const contentBoxStyle = {
        background: 'rgba(255, 255, 255, 0.8)', // Fondo semitransparente
        padding: '20px 40px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        maxWidth: '600px',
        width: '90%',
    };

    // Estilos en línea para los botones
    const buttonStyle = {
        margin: '10px',
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#ff6b6b',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s ease',
    };

    // Estilo adicional para el hover
    const buttonHoverStyle = {
        backgroundColor: '#ff8787',
    };

    return (
        <div style={backgroundStyle}>
            <div style={contentBoxStyle}>
                <h1 style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '15px' }}>Bienvenidos a MyLover!</h1>
                <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>
                    Este es un lugar especial para nosotros, para recordar y planificar nuestro futuro juntos.
                </p>

                <div>
                    <button
                        style={buttonStyle}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                        onClick={() => alert('Ir a miLover')}
                    >
                        Ir a miLover
                    </button>
                    <button
                        style={buttonStyle}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                        onClick={() => navigate('/calendar')} // Redirige a la página del calendario
                    >
                        Ver Calendario 
                    </button>
                    <button 
                        style={buttonStyle}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                        onClick={() => navigate('/friends')} 
                    >
                        Gestionar Amigos
                    </button>


                    <button
                        style={buttonStyle}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                        onClick={() => navigate('/profile')} // Redirige a la página de perfil
                    >
                        Ver Perfil
                    </button>

                    <button 
                        style={buttonStyle}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                        onClick={onLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
