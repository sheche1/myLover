import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage({ onLogout }) {
  const navigate = useNavigate();

  // Fondo con imagen
  const backgroundStyle = {
    position: 'relative',
    minHeight: '100vh',
    background: 'url(/imagenes/background.jpg) no-repeat center center/cover',
    fontFamily: "'Open Sans', sans-serif"
  };

  // Overlay con un gradiente rosado y una leve animación “sparkling”
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(160deg, rgba(255, 200, 220, 0.3), rgba(255, 180, 210, 0.4))',
    animation: 'pulseOverlay 6s ease-in-out infinite alternate',
    pointerEvents: 'none', // El overlay no bloquea clics
  };

  // Puedes añadir esta @keyframes en tu CSS global:
  // @keyframes pulseOverlay {
  //   0%   {opacity: 0.6;}
  //   100% {opacity: 0.9;}
  // }

  // Contenedor centrado
  const containerStyle = {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  };

  // Caja principal
  const contentBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    borderRadius: '16px',
    padding: '2.5rem 3rem',
    maxWidth: '600px',
    width: '90%',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    textAlign: 'center',
    backdropFilter: 'blur(6px)', // Si quieres un efecto glass
  };

  // Título con Great Vibes
  const titleStyle = {
    fontFamily: "'Great Vibes', cursive",
    color: '#ff6b6b',
    fontSize: '3rem',
    fontWeight: 400,
    marginBottom: '0.5rem',
  };

  const subtitleStyle = {
    color: '#555',
    fontSize: '1.1rem',
    marginBottom: '2.2rem',
  };

  // Grid de botones
  const buttonGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
    justifyItems: 'center'
  };

  const buttonStyle = {
    backgroundColor: '#ff6b6b',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    padding: '0.8rem 1.2rem',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '2px 3px 6px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    fontWeight: 600,
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#ff8f8f';
    e.target.style.transform = 'translateY(-4px)';
    e.target.style.boxShadow = '2px 6px 10px rgba(0,0,0,0.25)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '#ff6b6b';
    e.target.style.transform = 'none';
    e.target.style.boxShadow = '2px 3px 6px rgba(0,0,0,0.15)';
  };

  return (
    <div style={backgroundStyle}>
      {/* Overlay animado */}
      <div style={overlayStyle}></div>

      <div style={containerStyle}>
        <div style={contentBoxStyle}>
          <h1 style={titleStyle}>Bienvenidos a MyLover!</h1>
          <p style={subtitleStyle}>
            Este es un lugar especial para nosotros, para recordar y planificar
            nuestro futuro juntos.
          </p>

          <div style={buttonGridStyle}>
            <button
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/calendar')}
            >
              Ver Calendario
            </button>
            
            <button
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/friends')}
            >
              Gestionar Amigos
            </button>

            <button
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/send-letter')}
            >
              Enviar Carta
            </button>

            <button
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/received-letters')}
            >
              Cartas Recibidas
            </button>

            <button
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/profile')}
            >
              Ver Perfil
            </button>

            <button
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={onLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
