import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReceivedLettersPage() {
  const [letters, setLetters] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();

  const myEmail = localStorage.getItem('email') || '';
  const myPassword = localStorage.getItem('password') || '';

  useEffect(() => {
    loadLetters();
    // eslint-disable-next-line
  }, []);

  const loadLetters = async () => {
    try {
      const resp = await fetch(`http://localhost:8080/api/letters?receiverEmail=${myEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${myEmail}:${myPassword}`)
        }
      });
      if (!resp.ok) {
        throw new Error('Error al obtener cartas');
      }
      const data = await resp.json();
      setLetters(data);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar las cartas');
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  // Estilos
  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #ffecef, #fff)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Open Sans', sans-serif"
  };

  const containerStyle = {
    width: '90%',
    maxWidth: '600px',
    marginTop: '2rem'
  };

  const titleStyle = {
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '1.8rem'
  };

  const cardStyle = {
    margin: '1rem 0',
    padding: '0.8rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    background: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  };

  const cardHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  };

  const letterTitleStyle = {
    margin: '0.5rem 0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333'
  };

  const senderStyle = {
    margin: 0,
    color: '#555',
    marginBottom: '0.5rem'
  };

  const contentStyle = {
    margin: '0.5rem 0',
    color: '#444',
    lineHeight: '1.4'
  };

  const dateStyle = {
    fontSize: '0.85rem',
    color: '#999'
  };

  const buttonStyle = {
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '0.6rem 1.2rem',
    cursor: 'pointer',
    margin: '2rem auto',
    display: 'block',
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
        <h1 style={titleStyle}>Cartas Recibidas</h1>

        {letters.length === 0 ? (
          <p>No has recibido ninguna carta.</p>
        ) : (
          letters.map((letter, index) => {
            const isExpanded = (expandedIndex === index);

            // Efecto hover: si es expanded, aplica un leve “levantamiento”
            const combinedCardStyle = {
              ...cardStyle,
              ...(isExpanded ? cardHoverStyle : {})
            };

            return (
              <div
                key={letter.id}
                style={combinedCardStyle}
                onClick={() => toggleExpand(index)}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow; }}
                onMouseLeave={(e) => { 
                  if (!isExpanded) {
                    e.currentTarget.style.boxShadow = 'none'; 
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                <div style={letterTitleStyle}>
                  {letter.title || '(Sin título)'}
                </div>
                <p style={senderStyle}><strong>De:</strong> {letter.senderEmail}</p>

                {isExpanded && (
                  <>
                    <p style={contentStyle}>{letter.content}</p>
                    <p style={dateStyle}>Fecha: {letter.createdAt}</p>
                  </>
                )}
              </div>
            );
          })
        )}

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
  );
}

export default ReceivedLettersPage;
