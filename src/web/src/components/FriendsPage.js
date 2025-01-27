import React, { useEffect, useState } from 'react';
import './css/FriendsPage.css';

function FriendsPage() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [emailToSearch, setEmailToSearch] = useState('');
  const [error, setError] = useState('');

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
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');

        const response = await fetch('http://localhost:8080/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${email}:${password}`),
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener datos de amigos');
        }

        const data = await response.json();

        const uniqueRequests = (data.friendRequests || []).reduce((acc, req) => {
          if (!acc.find((item) => item.email === req.email)) {
            acc.push(req);
          }
          return acc;
        }, []);

        const uniqueFriends = (data.friends || []).reduce((acc, fr) => {
          if (!acc.find((item) => item.email === fr.email)) {
            acc.push(fr);
          }
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
  }, []);


  const handleFriendRequest = async () => {
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      const cleanEmailToSearch = emailToSearch.trim();

      const response = await fetch(
        `http://localhost:8080/api/friends/send?senderEmail=${email}&receiverEmail=${encodeURIComponent(cleanEmailToSearch)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${email}:${password}`),
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
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      const response = await fetch(
        `http://localhost:8080/api/friends/accept?receiverEmail=${email}&senderEmail=${senderEmail}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${email}:${password}`),
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
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      await fetch(
        `http://localhost:8080/api/friends/reject?receiverEmail=${email}&senderEmail=${senderEmail}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${email}:${password}`),
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
                <span>
                  {request.nombre || 'Usuario'} ({request.email})
                </span>
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


      <div className="friends-section">
        <h2>Lista de amigos</h2>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <div key={index} className="friend-item">
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
    </div>
  );
}

export default FriendsPage;
