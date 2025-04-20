import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ProfilePage.css';

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const navigate = useNavigate();
  const [editForm, setEditForm] = useState({
    nombre: '',
    apellido: '',
    nombrePareja: '',
    apellidoPareja: '',
    fechaNacimiento: '',
    fechaNacimientoPareja: '',
    fechaPrimerEncuentro: '',
  });

  const fetchProfile = async () => {
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      const response = await fetch(`http://localhost:8080/api/profile?t=${new Date().getTime()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${email}:${password}`)
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el perfil');
      }

      const data = await response.json();
      setUserData(data);
      setNewStatus(data.status || 'No establecido');
      console.log("Datos recibidos del perfil:", data);
    } catch (err) {
      console.error('Error al cargar los datos:', err);
      setError('Error al cargar el perfil.');
    }
  };

  useEffect(() => {
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
        throw new Error('Error al actualizar el perfil');
      }

      alert('Perfil actualizado con éxito');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      alert('Error al actualizar el perfil');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const email = localStorage.getItem('email')?.trim();
      const password = localStorage.getItem('password')?.trim();
  
      const response = await fetch(`http://localhost:8080/api/profile/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${email}:${password}`),
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) throw new Error("Error del servidor");
      setNewStatus(newStatus); 
      alert('Estado actualizado correctamente');
      
      await fetchProfile();
  
    } catch (error) { 
      console.error('Error:', error);
      alert('Error al actualizar el estado: ' + error.message);
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
        </div>
      )}

      {!isEditing && (
        <button className="profile-edit-btn" onClick={handleEditClick}>
          Editar Perfil
        </button>
      )}

      {isEditing && (
        <form onSubmit={handleUpdateProfile} className="profile-form">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={editForm.nombre}
            onChange={handleInputChange}
            required
          />

          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={editForm.apellido}
            onChange={handleInputChange}
            required
          />

          <label>Nombre de tu pareja</label>
          <input
            type="text"
            name="nombrePareja"
            value={editForm.nombrePareja}
            onChange={handleInputChange}
          />

          <label>Apellido de tu pareja</label>
          <input
            type="text"
            name="apellidoPareja"
            value={editForm.apellidoPareja}
            onChange={handleInputChange}
          />

          <label>Tu fecha de nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={editForm.fechaNacimiento}
            onChange={handleInputChange}
          />

          <label>Fecha de nacimiento de tu pareja</label>
          <input
            type="date"
            name="fechaNacimientoPareja"
            value={editForm.fechaNacimientoPareja}
            onChange={handleInputChange}
          />

          <label>Primer día que se conocieron</label>
          <input
            type="date"
            name="fechaPrimerEncuentro"
            value={editForm.fechaPrimerEncuentro}
            onChange={handleInputChange}
          />

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


      <div className="profile-status-container">
        <h3>Estado</h3>
        <p className="current-status">
          {userData.status  ? userData.status  : 'No establecido'}
        </p>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="status-select"
        >
          <option value="">Selecciona tu estado</option>
          <option value="Bien">Bien</option>
          <option value="Regular">Regular</option>
          <option value="Mal">Mal</option>
        </select>
        <button className="status-update-btn" onClick={handleStatusUpdate}>
          Actualizar Estado
        </button>
      </div>
      <button
          className="profile-back-btn"
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </button>

    </div>
  );
}

export default ProfilePage;
