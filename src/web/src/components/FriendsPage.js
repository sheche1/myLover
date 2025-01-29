import React, { useEffect, useState } from 'react';
import './css/FriendsPage.css';

function FriendsPage() {
  // Los mismos estados de siempre:
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [emailToSearch, setEmailToSearch] = useState('');
  const [error, setError] = useState('');
  
  // Para el chat offline
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chatMessages, setChatMessages] = useState([]); // Mensajes de la conversación con el amigo
  const [newMessage, setNewMessage] = useState('');

  // Tus credenciales
  const myEmail = localStorage.getItem('email') || '';
  const myPassword = localStorage.getItem('password') || '';

  /**
   * Mapea el "status" a un emoji (igual que antes).
   */
  const getStatusEmoji = (status) => {
    switch (status) {
      case 'Bien':    return '😊';
      case 'Regular': return '😐';
      case 'Mal':     return '😢';
      default:        return '❓';
    }
  };

  /**
   * Cargar datos de amigos/solicitudes al montar (como antes).
   */
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

        if (!response.ok) {
          throw new Error('Error al obtener datos de amigos');
        }

        const data = await response.json();
        // Filtrar duplicados
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
            // Añade Basic Auth
            'Authorization': 'Basic ' + btoa(`${myEmail}:${myPassword}`)
          }
        }
      );
      if (!resp.ok) {
        throw new Error('Error al cargar conversación');
      }
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
          // De nuevo, Basic Auth
          'Authorization': 'Basic ' + btoa(`${myEmail}:${myPassword}`)
        },
        body: JSON.stringify(body)
      });
      if (!resp.ok) {
        throw new Error('Error del servidor');
      }
      setNewMessage('');
      loadConversation(selectedFriend.email);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('No se pudo enviar el mensaje');
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

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

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

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

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

      {/* Sección: buscar amigos */}
      <div className="friends-search">
        <input
          type="email"
          placeholder="Introduce el correo del usuario"
          value={emailToSearch}
          onChange={(e) => setEmailToSearch(e.target.value)}
        />
        <button onClick={handleFriendRequest}>Enviar solicitud</button>
      </div>

      {/* Sección: solicitudes pendientes */}
      <div className="friends-section">
        <h2>Solicitudes de amistad</h2>
        {friendRequests.length > 0 ? (
          <div className="friend-requests">
            {friendRequests.map((request, index) => (
              <div key={index} className="request-card">
                <span>{request.nombre || 'Usuario'} ({request.email})</span>
                <div className="request-actions">
                  <button onClick={() => handleAcceptRequest(request.email)}>
                    Aceptar
                  </button>
                  <button onClick={() => handleRejectRequest(request.email)}>
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes solicitudes pendientes</p>
        )}
      </div>

      {/* Sección: lista de amigos */}
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

      {/* Sección: Chat con el amigo seleccionado */}
      {selectedFriend && (
        <div className="chat-container">
          <h2>Chat con {selectedFriend.nombre || 'Amigo'} ({selectedFriend.email})</h2>

          <div className="chat-messages">
            {chatMessages.map((msg, i) => {
              const isMe = (msg.senderEmail === myEmail);
              return (
                <div
                  key={i}
                  className={`chat-message ${isMe ? 'chat-message-own' : ''}`}
                >
                  <span className="chat-sender">
                    {isMe ? 'Yo' : msg.senderEmail}:
                  </span>
                  <span className="chat-content"> {msg.content}</span>
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
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendsPage;
