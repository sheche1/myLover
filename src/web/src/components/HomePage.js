import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaUserFriends,
  FaEnvelopeOpenText,
  FaInbox,
  FaUser,
  FaImages,
  FaCamera,
  FaBullseye,
  FaMapMarkedAlt,
  FaStar,
  FaHandshake
} from 'react-icons/fa';

function HomePage({ onLogout }) {
  const navigate = useNavigate();
  const [estadoPareja, setEstadoPareja] = useState(null);
  const [nombrePareja, setNombrePareja] = useState('');
  


  useEffect(() => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
  
    if (!email || !password) return;
  
    const credentials = btoa(`${email}:${password}`);
  
    fetch("http://localhost:8080/api/profile", {
      headers: {
        "Authorization": "Basic " + credentials
      }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.nombre) {
          localStorage.setItem("nombre", data.nombre);
        }
  
        fetch("http://localhost:8080/api/profile/partner-status", {
          headers: {
            "Authorization": "Basic " + credentials
          }
        })
          .then(res => res.ok ? res.json() : null)
          .then(partner => {
            if (partner?.status === "Regular" || partner?.status === "Mal") {
              setEstadoPareja(partner.status);
              setNombrePareja(partner.nombre || partner.email);
            }
          });
      });
  }, []);
  
  
  

  const buttons = [
    { icon: <FaCalendarAlt />, label: 'Nuestro Amor', route: '/calendar' },
    { icon: <FaUserFriends />, label: 'Pareja', route: '/friends' },
    { icon: <FaEnvelopeOpenText />, label: 'Enviar Carta', route: '/send-letter' },
    { icon: <FaInbox />, label: 'Cartas Recibidas', route: '/received-letters' },
    { icon: <FaUser />, label: 'Perfil', route: '/profile' },
    { icon: <FaImages />, label: 'Galería', route: '/gallery' },
    { icon: <FaCamera />, label: 'Subir Foto', route: '/upload-photo' },
    { icon: <FaStar />, label: 'Eventos', route: '/important-events' },
    { icon: <FaBullseye />, label: 'Metas', route: '/goals' },
    { icon: <FaMapMarkedAlt />, label: 'Mapa', route: '/memory-map' },
    { icon: <FaHandshake />, label: 'Colaboraciones', route: '/task-collaboration' }
  ];
  

  const bg = {
    position: 'relative',
    minHeight: '100vh',
    background: 'url(/imagenes/background.jpg) center/cover no-repeat',
    fontFamily: "'Poppins', sans-serif"
  };

  const overlay = {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(120deg, rgba(255,200,220,.4), rgba(255,180,210,.6))',
    backdropFilter: 'blur(2px)',
    animation: 'bgShift 15s ease-in-out infinite alternate',
    zIndex: 1
  };

  const container = {
    position: 'relative',
    zIndex: 2,
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const card = {
    width: '90%',
    maxWidth: 640,
    background: 'rgba(255,255,255,.85)',
    borderRadius: 20,
    padding: '3rem',
    textAlign: 'center',
    boxShadow: '0 12px 30px rgba(0,0,0,.15)',
    backdropFilter: 'blur(8px)'
  };

  const title = {
    fontFamily: "'Great Vibes', cursive",
    color: '#ff6b6b',
    fontSize: '3.2rem',
    marginBottom: '.3rem'
  };

  const subtitle = {
    color: '#555',
    fontSize: '1.1rem',
    marginBottom: '2.5rem'
  };

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
    gap: '1.2rem'
  };

  const btn = {
    background: 'transparent',
    border: '2px solid #ff6b6b',
    borderRadius: 12,
    color: '#ff6b6b',
    padding: '1.1rem .4rem',
    fontSize: '.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '.5rem',
    transition: 'all .25s ease'
  };

  const enter = (e) => {
    e.currentTarget.style.background = '#ff6b6b';
    e.currentTarget.style.color = '#fff';
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,.2)';
  };

  const leave = (e) => {
    e.currentTarget.style.background = 'transparent';
    e.currentTarget.style.color = '#ff6b6b';
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = 'none';
  };

  

  return (
    <div style={bg}>
      <style>
        {`
        @keyframes bgShift{
          0%{background-position:0% 50%}
          100%{background-position:100% 50%}
        }`}
      </style>
      <div style={overlay} />
      <div style={container}>
        
        <div style={card}>
          <h1 style={title}>Bienvenidos a MyLover!</h1>
          <p style={subtitle}>
            Un lugar especial para recordar y planificar nuestro presente y futuro juntos.
          </p>
          <div style={grid}>
            {buttons.map(({ icon, label, route }) => (
              <button
                key={label}
                style={btn}
                onMouseEnter={enter}
                onMouseLeave={leave}
                onClick={() => navigate(route)}
              >
                <span style={{ fontSize: '1.6rem' }}>{icon}</span>
                {label}
              </button>
            ))}
            <button
              style={{ ...btn, borderColor: '#999', color: '#999' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#999';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#999';
              }}
              onClick={onLogout}
            >
              Cerrar Sesión
            </button>
          </div>

          {estadoPareja && (
            <div style={{
              backgroundColor: estadoPareja === "Mal" ? "#ffe0e0" : "#fff3cd",
              color: "#a94442",
              padding: "1rem",
              borderRadius: "10px",
              marginBottom: "1.5rem",
              textAlign: "center",
              fontWeight: "bold",
              boxShadow: "0 0 8px rgba(0,0,0,0.1)"
            }}>
              ⚠️ {nombrePareja} se siente {estadoPareja.toLowerCase()}. Dale cariño hoy. ❤️
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
