import React, { useEffect, useState } from 'react';
import './css/FriendsPage.css';

function FriendsPage() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [emailToSearch, setEmailToSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');

        const response = await fetch(`http://localhost:8080/api/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${email}:${password}`)
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener datos de amigos');
        }

        const data = await response.json();
        setFriendRequests(data.friendRequests || []);
        setFriends(data.friends || []);
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
      const cleanEmailToSearch = emailToSearch.trim();

      const response = await fetch(
        `http://localhost:8080/api/friends/send?senderEmail=${email}&receiverEmail=${encodeURIComponent(cleanEmailToSearch)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${email}:${localStorage.getItem('password')}`)
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      alert('Solicitud enviada correctamente');
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
            'Authorization': 'Basic ' + btoa(`${email}:${password}`)
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setFriendRequests(friendRequests.filter(request => request.email !== senderEmail));
      alert('Solicitud aceptada');
      setFriends([...friends, { email: senderEmail }]);
    } catch (error) {
      console.error('Error al aceptar solicitud:', error);
      alert('Error al aceptar solicitud: ' + error.message);
    }
  };

  const handleRejectRequest = async (senderEmail) => {
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      await fetch(`http://localhost:8080/api/friends/reject?receiverEmail=${email}&senderEmail=${senderEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${email}:${password}`)
        }
      });

      setFriendRequests(friendRequests.filter(request => request.email !== senderEmail));
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

      <h2>Buscar amigos</h2>
      <input
        type="Friendemail"
        placeholder="Introduce el correo del usuario"
        value={emailToSearch}
        onChange={(e) => setEmailToSearch(e.target.value)}
      />
      <button onClick={handleFriendRequest}>Enviar solicitud</button>

      <h2>Solicitudes de amistad</h2>
      {friendRequests.length > 0 ? (
        friendRequests.map((request, index) => (
          <div key={index}>
            <span>{request.email}</span>
            <button onClick={() => handleAcceptRequest(request.email)}>Aceptar</button>
            <button onClick={() => handleRejectRequest(request.email)}>Rechazar</button>
          </div>
        ))
      ) : (
        <p>No tienes solicitudes pendientes</p>
      )}

      <h2>Lista de amigos</h2>
      {friends.length > 0 ? (
        friends.map((friend, index) => (
          <p key={index}>{friend.nombre} ({friend.email})</p>
        ))
      ) : (
        <p>No tienes amigos agregados</p>
      )}
    </div>
  );
}

export default FriendsPage;
