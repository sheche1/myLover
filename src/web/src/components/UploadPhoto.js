import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadPhoto() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Selecciona un archivo antes de subir');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('description', description);

    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (!email || !password) {
      alert('No estás autenticado. Inicia sesión primero.');
      return;
    }

    const credentials = btoa(`${email}:${password}`);

    try {
      const response = await fetch('http://localhost:8080/api/photos/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`
        },
        body: formData
      });

      const result = await response.text();
      console.log('Respuesta del servidor:', response.status, result);

      if (response.ok) {
        alert('📸 Foto subida con éxito');
        setCategory('');
        setDescription('');
        setSelectedFile(null);
      } else {
        alert(`❌ Error al subir la foto: ${result}`);
      }
    } catch (error) {
      console.error('Error al subir la foto:', error);
      alert('❌ Error al conectar con el servidor');
    }
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#66bb6a';
    e.target.style.transform = 'scale(1.04)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '#4caf50';
    e.target.style.transform = 'scale(1)';
  };

  const handleMouseEnterPink = (e) => {
    e.target.style.backgroundColor = '#ff8787';
  };

  const handleMouseLeavePink = (e) => {
    e.target.style.backgroundColor = '#ff6b6b';
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes fadeInPop {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        input:focus, textarea:focus {
          border-color: #a0d7a1 !important;
          box-shadow: 0 0 0 3px #a0d7a140 !important;
        }
      `}</style>
      <div style={styles.container}>
        <h2 style={styles.title}>📷 Subir Nueva Foto</h2>
        <form onSubmit={handleUpload} style={styles.form}>
          <label style={styles.label}>Seleccionar imagen:</label>
          <input type="file" onChange={handleFileChange} style={styles.inputFile} />

          <label style={styles.label}>Categoría:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ej: Vacaciones, Aniversario..."
            style={styles.inputText}
          />

          <label style={styles.label}>Descripción:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción breve de la foto"
            style={styles.inputText}
          />

          <button
            type="submit"
            style={styles.button}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            📤 Subir foto
          </button>

          <button
            type="button"
            style={styles.buttonBack}
            onClick={() => navigate('/')}
            onMouseEnter={handleMouseEnterPink}
            onMouseLeave={handleMouseLeavePink}
          >
            ⬅️ Volver al Inicio
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #ffecef, #fff)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Poppins', sans-serif"
  },
  container: {
    width: '90%',
    maxWidth: '500px',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
    animation: 'fadeInPop 0.6s ease-in-out'
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
    fontSize: '1.6rem',
    fontWeight: 700
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  label: {
    fontWeight: 600,
    color: '#555',
    marginBottom: '0.2rem'
  },
  inputText: {
    padding: '0.65rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    transition: 'border 0.3s ease'
  },
  inputFile: {
    padding: '0.5rem',
    border: '1px dashed #aaa',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer'
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s ease'
  },
  buttonBack: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#ff6b6b',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s ease'
  }
};

export default UploadPhoto;
