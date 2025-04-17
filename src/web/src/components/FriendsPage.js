import React, { useEffect, useState } from 'react';
import './css/FriendsPage.css';

function FriendsPage() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [emailToSearch, setEmailToSearch] = useState('');
  const [error, setError] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [questionSent, setQuestionSent] = useState(false);

  const myEmail = localStorage.getItem('email') || '';
  const myPassword = localStorage.getItem('password') || '';

  const predefinedQuestions = [
    '¿Qué te gusta de mí?',
    '¿Qué es algo que valoras mucho en una amistad?',
    '¿Cuál es tu recuerdo favorito conmigo?',
    '¿Qué es algo que siempre has querido preguntarme?',
    '¿Qué significa para ti la felicidad?',
    '¿Cómo te animas cuando estás triste?',
    '¿Qué lugar te gustaría visitar conmigo?',
    '¿Cuál es tu mayor sueño?',
    '¿Qué te hace sentir amado/a?',
    '¿Cuál es tu miedo más grande?',
    '¿Qué canción te recuerda a mí?',
    '¿Qué aprendiste de nuestra amistad?',
    '¿Qué cambiarías de ti mismo/a?',
    '¿Qué es algo que no muchos saben de ti?',
    '¿Cuál fue el mejor día de tu vida?',
    '¿Qué te hace sentir en paz?',
    '¿Cómo te gustaría que te recordaran?',
    '¿Qué harías si no tuvieras miedo?',
    '¿Qué significa el amor para ti?',
    '¿Qué te gustaría hacer conmigo que nunca hemos hecho?',
  ];

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'Bien': return '😊';
      case 'Regular': return '😐';
      case 'Mal': return '😢';
      default: return '❓';
    }
  };

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`),
          },
        });

        if (!response.ok) throw new Error('Error al obtener datos de amigos');

        const data = await response.json();

        const uniqueRequests = (data.friendRequests || []).reduce((acc, req) => {
          if (!acc.find((item) => item.email === req.email)) acc.push(req);
          return acc;
        }, []);
        const uniqueFriends = (data.friends || []).reduce((acc, f) => {
          if (!acc.find((item) => item.email === f.email)) acc.push(f);
          return acc;
        }, []);

        setFriendRequests(uniqueRequests);
        setFriends(uniqueFriends);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos de amigos.');
      }
    };

    fetchFriendsData();
  }, [myEmail, myPassword]);

  const loadConversation = async (friendEmail) => {
    try {
      const resp = await fetch(
        `http://localhost:8080/api/messages?user1=${myEmail}&user2=${friendEmail}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`),
          },
        }
      );
      if (!resp.ok) throw new Error('Error al cargar conversación');
      const msgs = await resp.json();
      setChatMessages(msgs);
    } catch (error) {
      console.error('Error al cargar conversación:', error);
      alert('No se pudo cargar la conversación');
    }
  };

  const sendOfflineMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    const body = {
      senderEmail: myEmail,
      receiverEmail: selectedFriend.email,
      content: newMessage.trim(),
    };

    try {
      const resp = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`),
        },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error('Error del servidor');

      setNewMessage('');
      loadConversation(selectedFriend.email);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('No se pudo enviar el mensaje');
    }
  };

  const sendRandomQuestion = async () => {
    if (!selectedFriend) return;

    const question = predefinedQuestions[Math.floor(Math.random() * predefinedQuestions.length)];

    const body = {
      senderEmail: myEmail,
      receiverEmail: selectedFriend.email,
      content: question,
    };

    try {
      const resp = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`),
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) throw new Error('Error del servidor');

      setQuestionSent(true);
      setTimeout(() => setQuestionSent(false), 3000);
      loadConversation(selectedFriend.email);
    } catch (error) {
      console.error('Error al enviar pregunta:', error);
      alert('No se pudo enviar la pregunta');
    }
  };

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setChatMessages([]);
    loadConversation(friend.email);
  };

  const handleFriendRequest = async () => {
    try {
      const cleanEmailToSearch = emailToSearch.trim();
      const response = await fetch(
        `http://localhost:8080/api/friends/send?senderEmail=${myEmail}&receiverEmail=${encodeURIComponent(cleanEmailToSearch)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`),
          },
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      alert('Solicitud enviada correctamente');
      setEmailToSearch('');
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      alert('Error al enviar solicitud: ' + error.message);
    }
  };

  const handleAcceptRequest = async (senderEmail) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/friends/accept?receiverEmail=${myEmail}&senderEmail=${senderEmail}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`),
          },
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      setFriendRequests((prev) =>
        prev.filter((request) => request.email !== senderEmail)
      );

      alert('Solicitud aceptada');

      setFriends((prevFriends) => {
        if (!prevFriends.find((f) => f.email === senderEmail)) {
          return [...prevFriends, { email: senderEmail, status: 'Desconocido' }];
        }
        return prevFriends;
      });
    } catch (error) {
      console.error('Error al aceptar solicitud:', error);
      alert('Error al aceptar solicitud: ' + error.message);
    }
  };

  const handleRejectRequest = async (senderEmail) => {
    try {
      await fetch(
        `http://localhost:8080/api/friends/reject?receiverEmail=${myEmail}&senderEmail=${senderEmail}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`),
          },
        }
      );

      setFriendRequests((prev) =>
        prev.filter((request) => request.email !== senderEmail)
      );

      alert('Solicitud rechazada');
    } catch (error) {
      console.error(error);
      alert('Error al rechazar solicitud');
    }
  };

  if (error) {
    return <div className="friends-error">{error}</div>;
  }

  return (
    <div className="friends-container">
      <h1 className="friends-title">Gestionar Amigos</h1>

      <div className="friends-search">
        <input
          type="email"
          placeholder="Introduce el correo del usuario"
          value={emailToSearch}
          onChange={(e) => setEmailToSearch(e.target.value)}
        />
        <button onClick={handleFriendRequest}>Enviar solicitud</button>
      </div>

      <div className="friends-section">
        <h2>Solicitudes de amistad</h2>
        {friendRequests.length > 0 ? (
          <div className="friend-requests">
            {friendRequests.map((request, index) => (
              <div key={index} className="request-card">
                <span>{request.nombre || 'Usuario'} ({request.email})</span>
                <div className="request-actions">
                  <button onClick={() => handleAcceptRequest(request.email)}>Aceptar</button>
                  <button onClick={() => handleRejectRequest(request.email)}>Rechazar</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes solicitudes pendientes</p>
        )}
      </div>

      <div className="friends-section">
        <h2>Lista de amigos</h2>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <div
              key={index}
              className="friend-item"
              onClick={() => handleSelectFriend(friend)}
            >
              <div className="friend-emoji">{getStatusEmoji(friend.status)}</div>
              <div className="friend-info">
                <p className="friend-name">{friend.nombre || 'Amigo'} ({friend.email})</p>
                <p className="friend-status"><strong>Estado:</strong> {friend.status || 'Desconocido'}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes amigos agregados</p>
        )}
      </div>

      {selectedFriend && (
        <div className="chat-container">
          <h2>Chat con {selectedFriend.nombre || 'Amigo'} ({selectedFriend.email})</h2>

          {questionSent && (
            <div className="chat-question" style={{ marginBottom: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
              ✅ Pregunta enviada con cariño ❤️
            </div>
          )}

          <div className="chat-messages">
            {chatMessages.map((msg, i) => {
              const isMe = msg.senderEmail === myEmail;
              const isQuestion = predefinedQuestions.includes(msg.content.trim());
              let styleClass = '';

              if (isMe && isQuestion) styleClass = 'chat-question-own';
              else if (isMe && !isQuestion) styleClass = 'chat-message-own';
              else if (!isMe && isQuestion) styleClass = 'chat-question-other';
              else styleClass = 'chat-message-other';

              return (
                <div key={i} className={`chat-message ${styleClass}`}>
                  <span className="chat-sender">{isMe ? 'Yo' : msg.senderEmail}:</span>
                  <span className="chat-content">{isQuestion ? '🧠 ' : ''}{msg.content}</span>
                </div>
              );
            })}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Escribe tu mensaje"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendOfflineMessage}>Enviar</button>
            <button onClick={sendRandomQuestion}>💌 Pregúntale algo especial</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendsPage;
