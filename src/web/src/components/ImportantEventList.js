import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/ImportantEventList.css';

function ImportantEventList() {
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [groupTitle, setGroupTitle] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [groupEditId, setGroupEditId] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [searchDate, setSearchDate] = useState('');



  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => fetchData(), 3000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    fetchEvents();
    fetchGroups();
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/important-events', {
        headers: { Authorization: `Basic ${getCredentials()}` }
      });
      const data = await res.json();
      setEvents(data);
    } catch {}
  };

  const fetchGroups = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/event-groups', {
        headers: { Authorization: `Basic ${getCredentials()}` }
      });
      const data = await res.json();
      setGroups(data);
    } catch {}
  };

  const getCredentials = () => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    return btoa(`${email}:${password}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { title, description, date };
    let url = 'http://localhost:8080/api/important-events';
    let method = 'POST';
    if (editId) {
      url = `http://localhost:8080/api/important-events/${editId}`;
      method = 'PUT';
    }
    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${getCredentials()}`
        },
        body: JSON.stringify(body)
      });
      setTitle('');
      setDescription('');
      setDate('');
      setEditId(null);
      fetchEvents();
    } catch {}
  };

  const handleEdit = (ev) => {
    setTitle(ev.title);
    setDescription(ev.description);
    setDate(ev.date);
    setEditId(ev.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este evento?')) return;
    try {
      await fetch(`http://localhost:8080/api/important-events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Basic ${getCredentials()}` }
      });
      fetchEvents();
    } catch {}
  };

  const handleEventSelect = (id) => {
    setSelectedEvents((p) => (
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    ));
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', groupTitle);
    formData.append('description', groupDescription);
    if (groupPhoto) formData.append('photo', groupPhoto);
    selectedEvents.forEach((id) => formData.append('eventIds', id));
    let url = 'http://localhost:8080/api/event-groups';
    let method = 'POST';
    if (groupEditId) {
      url = `http://localhost:8080/api/event-groups/${groupEditId}`;
      method = 'PUT';
    }
    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Basic ${getCredentials()}` },
        body: formData
      });
      if (res.ok) {
        setGroupTitle('');
        setGroupDescription('');
        setGroupPhoto(null);
        setSelectedEvents([]);
        setGroupEditId(null);
        fetchData();
        alert(groupEditId ? 'Colección actualizada' : 'Colección creada');
      } else {
        alert('Error al guardar la colección');
      }
    } catch {}
  };

  const handleDeleteGroup = async (id) => {
    if (!window.confirm('¿Eliminar esta colección?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/event-groups/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Basic ${getCredentials()}` }
      });
      if (res.ok) {
        fetchData();
        alert('Colección eliminada');
      }
    } catch {}
  };

  const handleEditGroup = (g) => {
    setGroupTitle(g.title);
    setGroupDescription(g.description);
    setGroupEditId(g.id);
    const evs = events
      .filter((e) => e.group && e.group.id === g.id)
      .map((e) => e.id);
    setSelectedEvents(evs);
  };

  const toggleGroup = (id) => {
    setExpandedGroups((p) => (
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    ));
  };

  return (
    <div className="event-page">
      <div className="event-container">
        <h2 className="event-title">📅 Línea de Tiempo</h2>
        <form className="event-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button type="submit">
            {editId ? 'Guardar cambios' : 'Añadir evento'}
          </button>
        </form>

        <h3 className="event-title">📦 Crear nueva colección</h3>
        <form className="event-form" onSubmit={handleGroupSubmit}>
          <input
            type="text"
            placeholder="Título del conjunto"
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Descripción del conjunto"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setGroupPhoto(e.target.files[0])}
          />
          <div className="select-events">
            <p>Selecciona los eventos:</p>
            <ul>
              {events.map((ev) => (
                <li key={ev.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(ev.id)}
                      onChange={() => handleEventSelect(ev.id)}
                    />
                    {ev.title} ({ev.date})
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <button type="submit">
            {groupEditId ? 'Actualizar colección' : 'Crear colección'}
          </button>
        </form>
        <h3 className="event-title">📂 Colecciones creadas</h3>
        {groups.map((g) => {
          const expanded = expandedGroups.includes(g.id);
          return (
            <div
              key={g.id}
              className="event-group"
              onClick={() => toggleGroup(g.id)}
            >
              <div className="group-header">
                <h2 className="group-title">{g.title}</h2>
              </div>
              <div className="group-body">
                <div className="group-description">{g.description}</div>
                <div className="image-container">
                  {g.photoUrl && (
                    <img
                      src={`http://localhost:8080${g.photoUrl}`}
                      alt="Portada"
                    />
                  )}
                </div>
              </div>
              <div className="group-footer">
                Número de eventos: {g.events ? g.events.length : 0}
              </div>
              <div
                className={`event-group-content ${expanded ? 'expanded' : ''}`}
              >
                <ul>
                  {g.events && g.events.map((ev, i) => (
                    <li
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedEventId(expandedEventId === ev.id ? null : ev.id);
                        }}
                        className={`event-item ${expandedEventId === ev.id ? 'expanded' : ''}`}
                        style={{ '--i': i }}
                      >
                        <div className="event-title-line">
                          📌 {ev.title}
                        </div>
                        {expandedEventId === ev.id && (
                          <div className="event-extra-info">
                            <p><strong>Descripción:</strong> {ev.description}</p>
                            <p><strong>Fecha:</strong> {ev.date}</p>
                          </div>
                        )}
                      </li>
                  ))}
                </ul>
              </div>
              <div
                className="event-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="edit" onClick={() => handleEditGroup(g)}>
                  Editar
                </button>
                <button className="delete" onClick={() => handleDeleteGroup(g.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}

        <h3 className="event-title">📌 Todos los eventos</h3>
        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <p style={{ marginBottom: '0.5rem', fontWeight: '500', color: '#444' }}>
            📅 Filtra tus eventos importantes por fecha
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />
              <button
                onClick={() => setSearchDate('')}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: 'linear-gradient(to right, #ff6b6b, #ff8f8f)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                ✨ Limpiar filtro
              </button>

          </div>
        </div>
        {(() => {
            const eventosFiltrados = events
              .filter(ev => !searchDate || ev.date === searchDate)
              .sort((a, b) => new Date(b.date) - new Date(a.date));

            return eventosFiltrados.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', marginTop: '1rem' }}>
                ❗ No se encontraron eventos para la fecha seleccionada.
              </p>
            ) : (
              eventosFiltrados.map((ev) => (
                <div key={ev.id} className="event-card">
                  <h4>{ev.title}</h4>
                  <p>{ev.description}</p>
                  <p className="date">Fecha: {ev.date}</p>
                  <div className="event-actions">
                    <button className="edit" onClick={() => handleEdit(ev)}>Editar</button>
                    <button className="delete" onClick={() => handleDelete(ev.id)}>Eliminar</button>
                  </div>
                </div>
              ))
            );
          })()}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="go-home-btn">
            Volver a Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ImportantEventList;
