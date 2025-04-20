import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SendLetterPage() {
  const [toEmail, setToEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [secretPassword, setSecretPassword] = useState('');

  const navigate = useNavigate();
  const myEmail = localStorage.getItem('email') || '';
  const myPassword = localStorage.getItem('password') || '';

  const handleSend = async () => {
    if (!toEmail.trim() || !content.trim()) {
      alert('Requiere un destinatario y contenido');
      return;
    }

    const letterObj = {
      senderEmail: myEmail,
      receiverEmail: toEmail.trim(),
      title: title.trim(),
      content: content.trim(),
      unlockDate,
      secretPassword
    };

    try {
      const resp = await fetch('http://localhost:8080/api/letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${myEmail}:${myPassword}`)
        },
        body: JSON.stringify(letterObj)
      });

      if (!resp.ok) throw new Error('Error al enviar la carta');

      alert('Carta enviada con éxito');
      setToEmail('');
      setTitle('');
      setContent('');
      setUnlockDate('');
      setSecretPassword('');
    } catch (error) {
      console.error(error);
      alert('No se pudo enviar la carta');
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #ffdde1, #ee9ca7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Poppins', sans-serif",
    animation: 'fadeIn 1s ease-in'
  };

  const containerStyle = {
    backgroundColor: '#ffffffdd',
    borderRadius: '15px',
    width: '90%',
    maxWidth: '600px',
    padding: '2rem 2.5rem',
    boxShadow: '0 12px 25px rgba(0, 0, 0, 0.15)',
    animation: 'popIn 0.6s ease-in-out'
  };

  const titleStyle = {
    textAlign: 'center',
    color: '#ff5e78',
    fontWeight: 700,
    marginBottom: '1.5rem',
    fontSize: '2rem',
    letterSpacing: '0.5px'
  };

  const labelStyle = {
    fontWeight: 600,
    color: '#444',
    marginBottom: '0.4rem',
    display: 'block'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.7rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    marginBottom: '1rem',
    transition: 'border 0.3s ease',
    outline: 'none'
  };

  const textareaStyle = {
    ...inputStyle,
    height: '120px',
    resize: 'vertical'
  };

  const inputFocusStyle = {
    borderColor: '#ff91a4',
    boxShadow: '0 0 0 3px #ffd4dd66'
  };

  const rowStyle = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  };

  const smallInputStyle = {
    flex: '1',
    padding: '0.6rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    transition: 'border 0.3s ease'
  };

  const buttonRowStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem'
  };

  const buttonStyle = {
    backgroundColor: '#ff6b81',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.7rem 1.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.3s ease'
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#ff8b9e';
    e.target.style.transform = 'scale(1.05)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '#ff6b81';
    e.target.style.transform = 'scale(1)';
  };

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        input:focus, textarea:focus {
          border-color: #ff91a4 !important;
          box-shadow: 0 0 0 3px #ffd4dd66 !important;
        }
      `}</style>

      <div style={containerStyle}>
        <h1 style={titleStyle}>Enviar carta privada</h1>

        <label style={labelStyle}>Para (correo):</label>
        <input
          type="email"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          style={inputStyle}
          placeholder="ejemplo@correo.com"
        />

        <label style={labelStyle}>Título (opcional):</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
          placeholder="Asunto de tu carta"
        />

        <label style={labelStyle}>Contenido:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={textareaStyle}
          placeholder="Escribe aquí el contenido de la carta"
        />

        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Fecha de desbloqueo (opcional):</label>
            <input
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              style={smallInputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>
              Contraseña (para abrir antes de la fecha):
            </label>
            <input
              type="password"
              value={secretPassword}
              onChange={(e) => setSecretPassword(e.target.value)}
              style={smallInputStyle}
            />
          </div>
        </div>

        <div style={buttonRowStyle}>
          <button
            style={buttonStyle}
            onClick={handleSend}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Enviar
          </button>
          <button
            style={buttonStyle}
            onClick={() => navigate('/')}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendLetterPage;
