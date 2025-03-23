import React, { useEffect, useState } from 'react';

function EventList() {
  const [eventos, setEventos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    const credentials = btoa(`${email}:${password}`);

    const response = await fetch('http://localhost:8080/api/eventos', {
      headers: { 'Authorization': `Basic ${credentials}` }
    });

    if (response.ok) {
      const data = await response.json();
      setEventos(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const evento = { titulo, descripcion, fecha };
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    const credentials = btoa(`${email}:${password}`);
    const url = editId
      ? `http://localhost:8080/api/eventos/${editId}`
      : 'http://localhost:8080/api/eventos';
    const method = editId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify(evento)
    });

    if (response.ok) {
      setTitulo('');
      setDescripcion('');
      setFecha('');
      setEditId(null);
      fetchEventos();
    }
  };

  const handleEdit = (evento) => {
    setTitulo(evento.titulo);
    setDescripcion(evento.descripcion);
    setFecha(evento.fecha);
    setEditId(evento.id);
  };

  const handleDelete = async (id) => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    const credentials = btoa(`${email}:${password}`);

    const response = await fetch(`http://localhost:8080/api/eventos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Basic ${credentials}` }
    });

    if (response.ok) {
      fetchEventos();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>✨ Eventos Importantes</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
            required
            style={styles.input}
          />
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción"
            required
            style={styles.input}
          />
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.primaryButton}>
            {editId ? '💾 Guardar Cambios' : '📌 Añadir Evento'}
          </button>
        </form>

        <div style={styles.cardGrid}>
          {eventos.map(evento => (
            <div key={evento.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{evento.titulo}</h3>
              <p style={styles.cardDescription}>{evento.descripcion}</p>
              <p style={styles.cardDate}>📅 {evento.fecha}</p>
              <div style={styles.cardActions}>
                <button style={styles.editButton} onClick={() => handleEdit(evento)}>✏️ Editar</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(evento.id)}>🗑 Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 💅 ESTILOS TIPO DASHBOARD
const styles = {
  page: {
    backgroundColor: '#f4f6fa',
    minHeight: '100vh',
    padding: '2rem'
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '600',
    marginBottom: '1.8rem',
    color: '#2c3e50',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2.5rem'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '10px',
    border: '1px solid #dce1ea',
    fontSize: '1rem',
    backgroundColor: '#ffffff'
  },
  primaryButton: {
    padding: '0.8rem',
    backgroundColor: '#3f9cfa',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(63, 156, 250, 0.2)',
    transition: 'all 0.2s ease-in-out'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: '0.5rem'
  },
  cardDescription: {
    color: '#666',
    marginBottom: '0.6rem'
  },
  cardDate: {
    fontWeight: '500',
    color: '#3f9cfa',
    marginBottom: '1rem'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  editButton: {
    padding: '0.4rem 0.8rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 500
  },
  deleteButton: {
    padding: '0.4rem 0.8rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#ff5c5c',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 500
  }
};

export default EventList;
