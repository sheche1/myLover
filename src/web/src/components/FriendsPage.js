import React, { useEffect, useState } from 'react';
import './css/FriendsPage.css';
import { useNavigate } from 'react-router-dom';

async function askAI(prompt) {
  try {
    const res = await fetch("http://localhost:8080/api/ia/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (typeof data === "string") {
      return data;
    }

    const content = data.choices?.[0]?.message?.content?.trim();
    return content || "No se pudo obtener respuesta.";
  } catch (err) {
    console.error("Error al contactar con backend:", err);
    return "No se pudo obtener respuesta.";
  }
}



function FriendsPage() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [emailToSearch, setEmailToSearch] = useState('');
  const [error, setError] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [questionSent, setQuestionSent] = useState(false);
  const navigate = useNavigate();

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
    '¿Qué te gustaría hacer conmigo que nunca hemos hecho?'
  ];

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'Bien':
        return '😊';
      case 'Regular':
        return '😐';
      case 'Mal':
        return '😢';
      default:
        return '❓';
    }
  };

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`)
          }
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        const uniqueRequests = (data.friendRequests || []).reduce((a, r) => {
          if (!a.find((i) => i.email === r.email)) a.push(r);
          return a;
        }, []);
        const uniqueFriends = (data.friends || []).reduce((a, f) => {
          if (!a.find((i) => i.email === f.email)) a.push(f);
          return a;
        }, []);
        setFriendRequests(uniqueRequests);
        setFriends(uniqueFriends);
      } catch {
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
            Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`)
          }
        }
      );
      if (!resp.ok) throw new Error();
      const msgs = await resp.json();
      setChatMessages(msgs);
    } catch {
      alert('No se pudo cargar la conversación');
    }
  };

  const sendOfflineMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;
    const body = {
      senderEmail: myEmail,
      receiverEmail: selectedFriend.email,
      content: newMessage.trim()
    };
    try {
      const resp = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`)
        },
        body: JSON.stringify(body)
      });
      if (!resp.ok) throw new Error();
      setNewMessage('');
      loadConversation(selectedFriend.email);
    } catch {
      alert('No se pudo enviar el mensaje');
    }
  };

  const sendRandomQuestion = async () => {
    if (!selectedFriend) return;
    const question =
      predefinedQuestions[Math.floor(Math.random() * predefinedQuestions.length)];
    const body = {
      senderEmail: myEmail,
      receiverEmail: selectedFriend.email,
      content: question
    };
    try {
      const resp = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`)
        },
        body: JSON.stringify(body)
      });
      if (!resp.ok) throw new Error();
      setQuestionSent(true);
      setTimeout(() => setQuestionSent(false), 3000);
      loadConversation(selectedFriend.email);
    } catch {
      alert('No se pudo enviar la pregunta');
    }
  };

  const handleAskAI = async () => {
    if (!selectedFriend) return;
    setAiThinking(true);
    try {
      const aiReply = await askAI(
        `Dame una idea de pregunta profunda o tema de conversación para hablar con mi amigo ${selectedFriend.nombre || selectedFriend.email}.`
      );
      setChatMessages((p) => [
        ...p,
        { senderEmail: 'AI', receiverEmail: myEmail, content: aiReply }
      ]);
    } catch {
      alert('La IA no pudo responder.');
    } finally {
      setAiThinking(false);
    }
  };

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setChatMessages([]);
    loadConversation(friend.email);
  };

  const handleFriendRequest = async () => {
    try {
      const clean = emailToSearch.trim();
      const response = await fetch(
        `http://localhost:8080/api/friends/send?senderEmail=${myEmail}&receiverEmail=${encodeURIComponent(
          clean
        )}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`)
          }
        }
      );
      if (!response.ok) throw new Error();
      alert('Solicitud enviada correctamente');
      setEmailToSearch('');
    } catch {
      alert('Error al enviar solicitud');
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
            Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`)
          }
        }
      );
      if (!response.ok) throw new Error();
      setFriendRequests((p) => p.filter((r) => r.email !== senderEmail));
      alert('Solicitud aceptada');
      setFriends((p) => {
        if (!p.find((f) => f.email === senderEmail))
          return [...p, { email: senderEmail, status: 'Desconocido' }];
        return p;
      });
    } catch {
      alert('Error al aceptar solicitud');
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
            Authorization: 'Basic ' + btoa(`${myEmail}:${myPassword}`)
          }
        }
      );
      setFriendRequests((p) => p.filter((r) => r.email !== senderEmail));
      alert('Solicitud rechazada');
    } catch {
      alert('Error al rechazar solicitud');
    }
  };

  if (error) return <div className="friends-error">{error}</div>;

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
        {friendRequests.length ? (
          <div className="friend-requests">
            {friendRequests.map((req, i) => (
              <div key={i} className="request-card">
                <span>
                  {req.nombre || 'Usuario'} ({req.email})
                </span>
                <div className="request-actions">
                  <button onClick={() => handleAcceptRequest(req.email)}>Aceptar</button>
                  <button onClick={() => handleRejectRequest(req.email)}>Rechazar</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes solicitudes pendientes</p>
        )}
      </div>

      <div className="friends-section">
        <h2>Mi persona especial</h2>
        {friends.length ? (
          friends.map((friend, i) => (
            <div key={i} className="friend-item" onClick={() => handleSelectFriend(friend)}>
              <div className="friend-emoji">{getStatusEmoji(friend.status)}</div>
              <div className="friend-info">
                <p className="friend-name">
                  {friend.nombre || 'Amigo'} ({friend.email})
                </p>
                <p className="friend-status">
                  <strong>Estado:</strong> {friend.status || 'Desconocido'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes amigos agregados</p>
        )}
      </div>

      {selectedFriend && (
        <div className="chat-container">
          <h2>
            Chat con {selectedFriend.nombre || 'Amigo'} ({selectedFriend.email})
          </h2>

          {questionSent && (
            <div className="chat-question" style={{ marginBottom: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
              ✅ Pregunta enviada con cariño ❤️
            </div>
          )}

          <div className="chat-messages">
            {chatMessages.map((msg, i) => {
              const isMe = msg.senderEmail === myEmail;
              const isAI = msg.senderEmail === 'AI';
              const isQuestion = predefinedQuestions.includes(msg.content.trim());
              let styleClass = '';
              if (isMe && isQuestion) styleClass = 'chat-question-own';
              else if (isMe && !isQuestion) styleClass = 'chat-message-own';
              else if (!isMe && isQuestion) styleClass = 'chat-question-other';
              else styleClass = 'chat-message-other';
              return (
                <div key={i} className={`chat-message ${styleClass}`}>
                  <span className="chat-sender">{isMe ? 'Yo' : isAI ? '🤖 IA' : msg.senderEmail}:</span>
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
            <button onClick={handleAskAI} disabled={aiThinking}>
              {aiThinking ? 'Pensando…' : '🧠 Sugerencia IA'}
            </button>
          </div>
        </div>
      )}
          <button
              className="friends-back-btn"
              onClick={() => navigate('/')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ff8787'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
            >
            Volver al Inicio
          </button>
    </div>
  );
}

export default FriendsPage;
