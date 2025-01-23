import React, { useEffect, useState } from 'react';
import './css/ProfilePage.css';

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [emailToSearch, setEmailToSearch] = useState('');

  const [editForm, setEditForm] = useState({
    nombre: '',
    apellido: '',
    nombrePareja: '',
    apellidoPareja: '',
    fechaNacimiento: '',
    fechaNacimientoPareja: '',
    fechaPrimerEncuentro: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');

        const response = await fetch(`http://localhost:8080/api/profile?email=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${email}:${password}`)
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener el perfil');
        }

        const data = await response.json();
        setUserData(data);
        setFriendRequests(data.friendRequests || []); // Asegurar que se cargan las solicitudes
      } catch (err) {
        console.error(err);
        setError('Error al cargar el perfil');
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    if (!userData) return;
    setEditForm({
      nombre: userData.nombre || '',
      apellido: userData.apellido || '',
      nombrePareja: userData.nombrePareja || '',
      apellidoPareja: userData.apellidoPareja || '',
      fechaNacimiento: userData.fechaNacimiento || '',
      fechaNacimientoPareja: userData.fechaNacimientoPareja || '',
      fechaPrimerEncuentro: userData.fechaPrimerEncuentro || '',
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      const response = await fetch('http://localhost:8080/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${email}:${password}`)
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar perfil');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Error al actualizar perfil: ' + err.message);
    }
  };

  const handleFriendRequest = async () => {
    try {
      const email = localStorage.getItem('email');
      const cleanEmailToSearch = emailToSearch.trim();
  
      console.log(`Enviando solicitud a: ${cleanEmailToSearch}`);
  
      const response = await fetch(`http://localhost:8080/api/friends/send?senderEmail=${email}&receiverEmail=${encodeURIComponent(cleanEmailToSearch)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${email}:${localStorage.getItem('password')}`)
        }
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error ${response.status}: ${errorData}`);
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

      const response = await fetch(`http://localhost:8080/api/friends/accept?receiverEmail=${email}&senderEmail=${senderEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${email}:${password}`)
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setFriendRequests(friendRequests.filter(request => request.email !== senderEmail));
      alert('Solicitud aceptada');
    } catch (error) {
      console.error('Error al aceptar solicitud:', error);
      alert('Error al aceptar solicitud: ' + error.message);
    }
  };

  const handleRejectRequest = async (senderEmail) => {
    try {
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');

        const response = await fetch(`http://localhost:8080/api/friends/reject?receiverEmail=${email}&senderEmail=${senderEmail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${email}:${password}`)
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        setFriendRequests(friendRequests.filter(request => request.email !== senderEmail));
        alert('Solicitud rechazada');
    } catch (error) {
        console.error('Error al rechazar solicitud:', error);
        alert('Error al rechazar solicitud: ' + error.message);
    }
};


  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!userData) {
    return <div className="profile-loading">Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">
        {isEditing ? 'Editar Perfil' : `Perfil de ${userData.nombre}`}
      </h1>

      {!isEditing && (
        <div className="profile-details">
          <p><strong>Apellido:</strong> {userData.apellido}</p>
          <p><strong>Nombre de tu pareja:</strong> {userData.nombrePareja}</p>
          <p><strong>Apellido de tu pareja:</strong> {userData.apellidoPareja}</p>
          <p><strong>Tu fecha de nacimiento:</strong> {userData.fechaNacimiento}</p>
          <p><strong>Fecha de nacimiento de tu pareja:</strong> {userData.fechaNacimientoPareja}</p>
          <p><strong>Primer día que se conocieron:</strong> {userData.fechaPrimerEncuentro}</p>
          <p><strong>Email:</strong> {userData.email}</p>

          <button className="profile-edit-btn" onClick={handleEditClick}>
            Editar Perfil
          </button>
        </div>
      )}

{isEditing && (
  <form onSubmit={handleUpdateProfile} className="profile-form">
    
    <div className="form-group">
      <label>Tu nombre</label>
      <input 
        type="text" 
        name="nombre" 
        value={editForm.nombre} 
        onChange={handleInputChange} 
        required
      />
    </div>

    <div className="form-group">
      <label>Tu apellido</label>
      <input 
        type="text" 
        name="apellido" 
        value={editForm.apellido} 
        onChange={handleInputChange} 
        required
      />
    </div>

    <div className="form-group">
      <label>Nombre de tu pareja</label>
      <input 
        type="text" 
        name="nombrePareja" 
        value={editForm.nombrePareja} 
        onChange={handleInputChange} 
      />
    </div>

    <div className="form-group">
      <label>Apellido de tu pareja</label>
      <input 
        type="text" 
        name="apellidoPareja" 
        value={editForm.apellidoPareja} 
        onChange={handleInputChange} 
      />
    </div>

    <div className="form-group">
      <label>Tu fecha de nacimiento</label>
      <input 
        type="date" 
        name="fechaNacimiento" 
        value={editForm.fechaNacimiento} 
        onChange={handleInputChange} 
      />
    </div>

    <div className="form-group">
      <label>Fecha de nacimiento de tu pareja</label>
      <input 
        type="date" 
        name="fechaNacimientoPareja" 
        value={editForm.fechaNacimientoPareja} 
        onChange={handleInputChange} 
      />
    </div>

    <div className="form-group">
      <label>Primer día que se conocieron</label>
      <input 
        type="date" 
        name="fechaPrimerEncuentro" 
        value={editForm.fechaPrimerEncuentro} 
        onChange={handleInputChange} 
      />
    </div>

    <button type="submit" className="profile-save-btn">Guardar</button>
    <button 
      type="button" 
      className="profile-cancel-btn" 
      onClick={() => setIsEditing(false)}
    >
      Cancelar
    </button>

  </form>
)}


      <h2>Buscar amigos</h2>
      <input
        type="email"
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
    </div>
  );
}

export default ProfilePage;
