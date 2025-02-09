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
      if (!resp.ok) {
        throw new Error('Error al enviar la carta');
      }
      alert('Carta enviada con éxito');
      // Limpiar el formulario
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

  // ---------- Estilos en línea ----------

  // Fondo en gradiente
  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #ffecef, #fff)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Open Sans', sans-serif"
  };

  // Tarjeta central
  const containerStyle = {
    backgroundColor: '#fff',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '600px',
    padding: '2rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    margin: '2rem'
  };

  const titleStyle = {
    textAlign: 'center',
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    fontSize: '1.8rem'
  };

  // Label y input
  const labelStyle = {
    display: 'block',
    margin: '0.5rem 0 0.3rem',
    fontWeight: 600,
    color: '#444'
  };

  const inputStyle = {
    width: '100%',
    marginBottom: '1rem',
    padding: '0.6rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  };

  const textareaStyle = {
    ...inputStyle,
    height: '120px',
    resize: 'vertical'
  };

  // Para agrupar la fecha y la contraseña en la misma línea
  const rowStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap' // Para que no se desborde en pantallas pequeñas
  };

  const miniLabelStyle = {
    fontWeight: 600,
    color: '#444',
    margin: '0.5rem 0 0.3rem'
  };

  const smallInputStyle = {
    flex: '1',
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '0.95rem'
  };

  // Botones
  const buttonRowStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem'
  };

  const buttonStyle = {
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '0.6rem 1.2rem',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease'
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#ff8787';
  };
  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '#ff6b6b';
  };

  return (
    <div style={pageStyle}>
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
          <div style={{ flex: '1 1 auto' }}>
            <label style={miniLabelStyle}>
              Fecha de desbloqueo (opcional)
            </label>
            <input
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              style={smallInputStyle}
            />
          </div>

          <div style={{ flex: '1 1 auto' }}>
            <label style={miniLabelStyle}>
              Contraseña (para abrir antes de la fecha)
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
