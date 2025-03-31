import React, { useEffect, useState } from 'react';

function ImportantEventList() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      const credentials = btoa(`${email}:${password}`);

      const response = await fetch('http://localhost:8080/api/important-events', {
        method: 'GET',
        headers: { 'Authorization': `Basic ${credentials}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Could not load events');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      const credentials = btoa(`${email}:${password}`);

      const newEvent = { title, description, date };
      let url = 'http://localhost:8080/api/important-events';
      let method = 'POST';

      if (editId) {
        url = `http://localhost:8080/api/important-events/${editId}`;
        method = 'PUT';
      }

      const resp = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify(newEvent)
      });

      if (!resp.ok) {
        throw new Error('Failed to save event');
      }

      setTitle('');
      setDescription('');
      setDate('');
      setEditId(null);
      fetchEvents();

    } catch (error) {
      console.error('Error saving event:', error);
      alert('Could not save event');
    }
  };

  const handleEdit = (eventItem) => {
    setTitle(eventItem.title);
    setDescription(eventItem.description);
    setDate(eventItem.date);
    setEditId(eventItem.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      const credentials = btoa(`${email}:${password}`);

      const resp = await fetch(`http://localhost:8080/api/important-events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${credentials}` }
      });

      if (!resp.ok) {
        throw new Error('Failed to delete event');
      }

      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Could not delete event');
    }
  };


  const pageStyles = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff9f9 20%, #ffebf0 80%)',
    padding: '2rem',
    fontFamily: "'Poppins', sans-serif"
  };

  const containerStyles = {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#ffffffcc',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
    borderRadius: '16px',
    padding: '2rem'
  };

  const titleStyles = {
    textAlign: 'center',
    fontSize: '2.2rem',
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: '1.5rem',
  };

  const formStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '2rem',
    justifyContent: 'center',
  };

  const inputStyles = {
    flex: '1 1 150px',
    minWidth: '120px',
    padding: '0.6rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#fff'
  };

  const buttonAddStyles = {
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#ff6b6b',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontWeight: 'bold',
    marginTop: '0.3rem'
  };

  const buttonAddHoverStyles = {
    backgroundColor: '#ff8f8f'
  };

  const handleAddMouseEnter = (e) => {
    Object.assign(e.target.style, buttonAddHoverStyles);
  };
  const handleAddMouseLeave = (e) => {
    Object.assign(e.target.style, buttonAddStyles);
  };

  const listStyles = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const eventCardStyles = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '1rem',
    marginBottom: '1rem',
    transition: 'transform 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const eventCardHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
  };
  const eventCardLeave = (e) => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  };

  const eventTitleStyles = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  };

  const eventDescStyles = {
    margin: 0,
    color: '#555',
    fontSize: '0.95rem'
  };

  const eventDateStyles = {
    fontStyle: 'italic',
    color: '#777',
    fontSize: '0.9rem'
  };

  const buttonRowStyles = {
    display: 'flex',
    gap: '0.5rem'
  };

  const buttonStyles = {
    padding: '0.4rem 0.8rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    color: '#fff'
  };

  const editButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#3fa7fc'
  };

  const deleteButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#ff6b6b'
  };

  return (
    <div style={pageStyles}>
      <div style={containerStyles}>
        <h2 style={titleStyles}>Important Events</h2>
        <form onSubmit={handleSubmit} style={formStyles}>
          <input
            type="text"
            placeholder="Title"
            style={inputStyles}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            style={inputStyles}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="date"
            style={inputStyles}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button
            type="submit"
            style={buttonAddStyles}
            onMouseEnter={handleAddMouseEnter}
            onMouseLeave={handleAddMouseLeave}
          >
            {editId ? 'Save Changes' : 'Add Event'}
          </button>
        </form>

        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <ul style={listStyles}>
            {events.map((eventItem) => (
              <li
                key={eventItem.id}
                style={eventCardStyles}
                onMouseEnter={eventCardHover}
                onMouseLeave={eventCardLeave}
              >
                <p style={eventTitleStyles}>{eventItem.title}</p>
                <p style={eventDescStyles}>{eventItem.description}</p>
                <p style={eventDateStyles}>Date: {eventItem.date}</p>
                <div style={buttonRowStyles}>
                  <button
                    style={editButtonStyles}
                    onClick={() => handleEdit(eventItem)}
                  >
                    Edit
                  </button>
                  <button
                    style={deleteButtonStyles}
                    onClick={() => handleDelete(eventItem.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ImportantEventList;
