import React, { useState, useEffect } from 'react';

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, [filterCategory]);

  const fetchPhotos = async () => {
    try {
      let url = 'http://localhost:8080/api/photos';
      if (filterCategory.trim() !== '') {
        url = `http://localhost:8080/api/photos/category/${filterCategory}`;
      }

      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");
      if (!email || !password) {
        alert('No estás autenticado. Inicia sesión primero.');
        return;
      }

      const credentials = btoa(`${email}:${password}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      } else {
        console.error('Error al obtener fotos. Status:', response.status);
      }
    } catch (error) {
      console.error('Error al hacer fetch:', error);
    }
  };

  const handleDelete = async (photoId) => {
    const confirm = window.confirm('¿Estás seguro de que quieres eliminar esta foto?');
    if (!confirm) return;

    try {
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");
      const credentials = btoa(`${email}:${password}`);

      const response = await fetch(`http://localhost:8080/api/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      if (response.ok) {
        setPhotos(photos.filter(photo => photo.id !== photoId));
      } else {
        console.error('Error al eliminar la foto. Status:', response.status);
      }
    } catch (error) {
      console.error('Error al eliminar la foto:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📸 Galería de Fotos</h2>

      <div style={styles.filterContainer}>
        <label style={styles.filterLabel}>Filtrar por categoría:</label>
        <input
          type="text"
          placeholder="Vacaciones, Cumpleaños, etc."
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.gallery}>
        {photos.map(photo => (
          <div key={photo.id} style={styles.card}>
            <img
              src={photo.url}
              alt={photo.description}
              style={styles.image}
            />
            <p style={styles.category}><strong>Categoría:</strong> {photo.category}</p>
            <p style={styles.description}>{photo.description}</p>
            <button onClick={() => handleDelete(photo.id)} style={styles.deleteButton}>
              🗑 Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9f9fb',
    minHeight: '100vh'
  },
  title: {
    textAlign: 'center',
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#333'
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2rem',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  filterLabel: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#333'
  },
  searchInput: {
    padding: '0.7rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '10px',
    fontSize: '1rem',
    width: '300px',
    outline: 'none',
    backgroundColor: '#fff',
    transition: '0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  gallery: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '2rem'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    padding: '1rem',
    width: '220px',
    textAlign: 'center',
    transition: 'transform 0.2s ease-in-out'
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    marginBottom: '1rem'
  },
  category: {
    fontSize: '0.95rem',
    color: '#666',
    marginBottom: '0.5rem'
  },
  description: {
    fontSize: '1rem',
    color: '#444',
    marginBottom: '1rem'
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff5c5c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};

export default PhotoGallery;
