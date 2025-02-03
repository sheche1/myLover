import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SendLetterPage() {
  const [toEmail, setToEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
      content: content.trim()
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
      setToEmail('');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error(error);
      alert('No se pudo enviar la carta');
    }
  };

  // Estilos para un fondo pastel
  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #ffecef, #fff)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Open Sans', sans-serif"
  };

  // Contenedor principal
  const containerStyle = {
    width: '90%',
    maxWidth: '600px',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  };

  // Título
  const titleStyle = {
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '1.8rem'
  };

  // Etiquetas de texto
  const labelStyle = {
    display: 'block',
    margin: '0.5rem 0 0.3rem',
    fontWeight: '600',
    color: '#444'
  };

  // Inputs
  const inputStyle = {
    width: '100%',
    marginBottom: '1rem',
    padding: '0.6rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '1rem'
  };

  // Textarea
  const textareaStyle = {
    ...inputStyle,
    height: '120px',
    resize: 'vertical',
    lineHeight: '1.5'
  };

  // Botones
  const buttonContainer = {
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
    transition: 'background-color 0.3s ease',
    fontSize: '1rem'
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

        <div style={buttonContainer}>
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
