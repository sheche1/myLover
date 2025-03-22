import React, { useState } from 'react';

function UploadPhoto() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

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

    // 🔐 Obtenemos email y password desde el localStorage
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (!email || !password) {
      alert('No estás autenticado. Inicia sesión primero.');
      return;
    }

    // Codificar credenciales en Base64
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

  return (
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

        <button type="submit" style={styles.button}>📤 Subir foto</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '3rem auto',
    padding: '2rem',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Segoe UI, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    marginBottom: '0.3rem'
  },
  inputText: {
    padding: '0.6rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  },
  inputFile: {
    padding: '0.5rem',
    border: '1px dashed #aaa',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  },
  button: {
    marginTop: '1rem',
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  }
};

export default UploadPhoto;
