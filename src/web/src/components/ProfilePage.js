import React, { useEffect, useState } from 'react';
import './css/ProfilePage.css';

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
    
        const response = await fetch(`http://localhost:8080/api/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${email}:${password}`)
          }
        });
    
        if (!response.ok) {
          throw new Error(`Error al obtener perfil: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Datos recibidos:", data);
    
        if (data && typeof data === 'object') {
          setUserData(data);
        } else {
          console.error("Estructura de datos incorrecta:", data);
          setError("Estructura de datos incorrecta");
        }
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError('Error al cargar el perfil.');
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
    </div>
  );
}

export default ProfilePage;
