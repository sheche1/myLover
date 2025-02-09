import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReceivedLettersPage() {
  const [letters, setLetters] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Para contraseñas antes de la fecha
  const [passwordPromptIndex, setPasswordPromptIndex] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState('');

  // NUEVO: Array de índices de cartas que se han desbloqueado por contraseña
  const [unlockedIndices, setUnlockedIndices] = useState([]);

  const navigate = useNavigate();
  const myEmail = localStorage.getItem('email') || '';
  const myPassword = localStorage.getItem('password') || '';

  // Cargar las cartas al montar
  useEffect(() => {
    loadLetters();
    // eslint-disable-next-line
  }, []);

  // 1) Cargar cartas (GET)
  const loadLetters = async () => {
    try {
      const resp = await fetch(`http://localhost:8080/api/letters?receiverEmail=${myEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`),
        },
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

  // 2) Eliminar carta (DELETE)
  const handleDelete = async (letterId, e) => {
    e.stopPropagation(); // Evita expandir la carta al pulsar el botón
    if (!window.confirm('¿Seguro que deseas eliminar esta carta?')) return;

    try {
      const resp = await fetch(`http://localhost:8080/api/letters/${letterId}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`),
        },
      });
      if (!resp.ok) {
        throw new Error('Error al eliminar la carta');
      }
      alert('Carta eliminada con éxito');
      setLetters((prev) => prev.filter((l) => l.id !== letterId));
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar la carta');
    }
  };

  // 3) Click en la carta => expandir, pedir contraseña si hace falta
  const handleCardClick = (index) => {
    const letter = letters[index];
    let unlockDateObj = null;
    if (letter.unlockDate) {
      unlockDateObj = new Date(letter.unlockDate);
    }
    const now = new Date();

    // Si no hay fecha o ya pasó => expandir directo
    if (!unlockDateObj || now >= unlockDateObj) {
      setExpandedIndex(index);
      setPasswordPromptIndex(null);
      return;
    }

    // Si la fecha aún no llega
    if (letter.secretPassword) {
      // Mostrar modal para introducir contraseña
      setPasswordPromptIndex(index);
    } else {
      alert(`Esta carta está bloqueada hasta: ${letter.unlockDate}`);
    }
  };

  // 4) Verificar contraseña en el modal
  const handleCheckPassword = () => {
    if (passwordPromptIndex === null) return;
    const letter = letters[passwordPromptIndex];
    // Comparar
    if (enteredPassword === letter.secretPassword) {
      // Contraseña correcta => expandimos la carta
      setExpandedIndex(passwordPromptIndex);
      // Y marcamos este índice como “desbloqueado”
      setUnlockedIndices((prev) => [...prev, passwordPromptIndex]);

      setPasswordPromptIndex(null);
      setEnteredPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  // Modal para la contraseña
  const renderPasswordPrompt = () => {
    if (passwordPromptIndex === null) return null;
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Introduce contraseña</h3>
          <input
            type="password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            style={inputPasswordStyle}
          />
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button onClick={handleCheckPassword} style={btnModalStyle}>
              Abrir
            </button>
            <button
              onClick={() => {
                setPasswordPromptIndex(null);
                setEnteredPassword('');
              }}
              style={btnCancelStyle}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -----------------------------------------------------
  // Estilos
  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #ffecef, #fff6f9)',
    fontFamily: "'Open Sans', sans-serif",
    position: 'relative',
    padding: '2rem',
  };

  const titleStyle = {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '2.5rem',
    color: '#ff6b6b',
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: '2rem',
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  };

  const letterCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1rem 1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const handleLetterMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-4px) rotateX(1deg)';
    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
  };
  const handleLetterMouseLeave = (e) => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
  };

  const letterTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.3rem',
  };

  const senderStyle = {
    margin: 0,
    color: '#555',
    marginBottom: '0.5rem',
    fontStyle: 'italic',
  };

  const hintStyle = {
    color: '#777',
    fontStyle: 'italic',
  };

  const contentStyle = {
    marginTop: '0.5rem',
    color: '#444',
    lineHeight: '1.5',
  };

  const dateStyle = {
    marginTop: '0.3rem',
    fontSize: '0.85rem',
    color: '#999',
  };

  const deleteBtnStyle = {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  };

  const backButtonStyle = {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '0.7rem 1.2rem',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s ease',
    margin: '2rem auto 0',
    display: 'block',
  };

  const handleBackMouseEnter = (e) => {
    e.target.style.backgroundColor = '#ff8f8f';
  };
  const handleBackMouseLeave = (e) => {
    e.target.style.backgroundColor = '#ff6b6b';
  };

  // Modal overlay
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  };

  const modalStyle = {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    width: '300px',
  };

  const inputPasswordStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const btnModalStyle = {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '0.5rem 1rem',
    marginRight: '0.5rem',
    cursor: 'pointer',
  };

  const btnCancelStyle = {
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  };

  // Render principal
  return (
    <div style={pageStyle}>
      {/* Modal contraseña si hace falta */}
      {renderPasswordPrompt()}

      <h1 style={titleStyle}>Cartas Recibidas</h1>

      <div style={containerStyle}>
        {letters.length === 0 ? (
          <p>No has recibido ninguna carta.</p>
        ) : (
          letters.map((letter, index) => {
            // Carta expandida?
            const isExpanded = expandedIndex === index;

            // Fecha
            let unlockDateObj = null;
            let canReadNow = true;
            if (letter.unlockDate) {
              unlockDateObj = new Date(letter.unlockDate);
              const now = new Date();
              if (now < unlockDateObj) {
                canReadNow = false;
              }
            }

            // Si la carta se desbloqueó por contraseña
            const isUnlockedByPassword = unlockedIndices.includes(index);

            // Si la fecha ya pasó O la carta se desbloqueó con password => se muestra
            const canShowContent = canReadNow || isUnlockedByPassword;

            return (
              <div
                key={letter.id}
                style={letterCardStyle}
                onMouseEnter={handleLetterMouseEnter}
                onMouseLeave={handleLetterMouseLeave}
                onClick={() => handleCardClick(index)}
              >
                <div style={letterTitleStyle}>
                  {letter.title || '(Sin título)'}
                </div>
                <p style={senderStyle}>De: {letter.senderEmail}</p>

                {/* Si no está expandida y no se puede ver, mensaje */}
                {!isExpanded && !canShowContent && letter.unlockDate && (
                  <p style={hintStyle}>
                    Podrás leer esta carta a partir de: {letter.unlockDate}
                  </p>
                )}

                {/* Si está expandida */}
                {isExpanded && (
                  <>
                    {canShowContent ? (
                      <>
                        <p style={contentStyle}>{letter.content}</p>
                        <p style={dateStyle}>Fecha creación: {letter.createdAt}</p>
                        {letter.unlockDate && (
                          <p style={dateStyle}>Desbloqueo: {letter.unlockDate}</p>
                        )}
                      </>
                    ) : (
                      <p style={hintStyle}>
                        Esta carta está bloqueada hasta: {letter.unlockDate}
                      </p>
                    )}

                    {/* Botón eliminar */}
                    <button
                      style={deleteBtnStyle}
                      onClick={(e) => handleDelete(letter.id, e)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            );
          })
        )}

        <button
          style={backButtonStyle}
          onClick={() => navigate('/')}
          onMouseEnter={handleBackMouseEnter}
          onMouseLeave={handleBackMouseLeave}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default ReceivedLettersPage;
