import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { FaTrash, FaEdit, FaSave, FaCamera, FaHome } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const heartIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/833/833472.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const isCoord = (v) => typeof v === 'number' && !Number.isNaN(v);

function MemoryMapPage() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [tempPoint, setTempPoint] = useState(null);
  const [tempForm, setTempForm] = useState({ title: '', description: '', dateVisited: '' });
  const [tempPhoto, setTempPhoto] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dateVisited: '',
    latitude: null,
    longitude: null
  });
  const [editPhoto, setEditPhoto] = useState(null);

  const creds = () => {
    const e = localStorage.getItem('email');
    const p = localStorage.getItem('password');
    return btoa(`${e}:${p}`);
  };

  const load = async () => {
    const r = await fetch('http://localhost:8080/api/memory-locations', {
      headers: { Authorization: `Basic ${creds()}` }
    });
    if (!r.ok) return;
    const data = await r.json();
    setLocations(
      (Array.isArray(data) ? data : []).filter(
        (d) => isCoord(d.latitude) && isCoord(d.longitude)
      ).sort((a, b) => new Date(a.dateVisited) - new Date(b.dateVisited))
    );
  };

  useEffect(() => { load(); }, []);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng || {};
        if (isCoord(lat) && isCoord(lng)) {
          setTempPoint({ lat, lng });
          setEditId(null);
        }
      }
    });
    return null;
  }

  const saveNew = async () => {
    const body = {
      title: tempForm.title.trim(),
      description: tempForm.description.trim(),
      latitude: tempPoint.lat,
      longitude: tempPoint.lng,
      dateVisited: tempForm.dateVisited
    };
    const r = await fetch('http://localhost:8080/api/memory-locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${creds()}`
      },
      body: JSON.stringify(body)
    });
    if (!r.ok) return alert('Error al guardar');
    const saved = await r.json();

    if (tempPhoto) {
      const fd = new FormData();
      fd.append('file', tempPhoto);
      await fetch(`http://localhost:8080/api/memory-locations/${saved.id}/photo`, {
        method: 'POST',
        headers: { Authorization: `Basic ${creds()}` },
        body: fd
      });
    }

    setTempPoint(null);
    setTempForm({ title: '', description: '', dateVisited: '' });
    setTempPhoto(null);
    load();
  };

  const saveEdit = async () => {
    await fetch(`http://localhost:8080/api/memory-locations/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${creds()}`
      },
      body: JSON.stringify(editForm)
    });

    if (editPhoto) {
      const fd = new FormData();
      fd.append('file', editPhoto);
      await fetch(`http://localhost:8080/api/memory-locations/${editId}/photo`, {
        method: 'POST',
        headers: { Authorization: `Basic ${creds()}` },
        body: fd
      });
    }

    setEditId(null);
    setEditPhoto(null);
    load();
  };

  const del = async (id) => {
    if (!window.confirm('¿Eliminar este recuerdo?')) return;
    await fetch(`http://localhost:8080/api/memory-locations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Basic ${creds()}` }
    });
    load();
  };

  const center = [40.4167, -3.7033];

  const renderFormFields = (form, setForm, photo, setPhoto, onSave, onCancel) => (
    <>
      <motion.input
        style={st.input}
        placeholder="Título"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        whileFocus={{ scale: 1.02 }}
      />
      <motion.textarea
        style={st.ta}
        placeholder="Descripción"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        whileFocus={{ scale: 1.02 }}
      />
      <motion.input
        type="date"
        style={st.input}
        value={form.dateVisited}
        onChange={(e) => setForm({ ...form, dateVisited: e.target.value })}
        whileFocus={{ scale: 1.02 }}
      />
      <label style={st.label}>
        <FaCamera />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
      </label>
      <div style={st.row}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={st.btnSave}
          onClick={onSave}
        >
          <FaSave /> Guardar
        </motion.button>
        <button style={st.btnCancel} onClick={onCancel}>Cancelar</button>
      </div>
    </>
  );

  return (
    <div style={st.page}>
      <motion.h1
        style={st.h1}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        💖 Mapa de Recuerdos 💖
      </motion.h1>

      <MapContainer center={center} zoom={5} style={st.map} scrollWheelZoom>
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />

        {locations.map((l) => (
          <Marker key={l.id} position={[l.latitude, l.longitude]} icon={heartIcon}>
            <Popup closeOnClick={false}>
              <AnimatePresence>
                {editId !== l.id ? (
                  <motion.div
                    style={st.card}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    {l.photoUrl && (
                      <img src={`http://localhost:8080${l.photoUrl}`} alt="" style={st.img} />
                    )}
                    <h3 style={st.title}>{l.title}</h3>
                    <p style={st.text}>{l.description}</p>
                    <p style={st.date}>{l.dateVisited || 'Sin fecha'}</p>
                    <div style={st.row}>
                      <button
                        style={st.btnEdit}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditId(l.id);
                          setEditForm({
                            title: l.title,
                            description: l.description,
                            dateVisited: l.dateVisited || '',
                            latitude: l.latitude,
                            longitude: l.longitude
                          });
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        style={st.btnDel}
                        onClick={(e) => {
                          e.stopPropagation();
                          del(l.id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    style={st.form}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    {renderFormFields(
                      editForm,
                      setEditForm,
                      editPhoto,
                      setEditPhoto,
                      saveEdit,
                      () => {
                        setEditId(null);
                        setEditPhoto(null);
                      }
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Popup>
          </Marker>
        ))}

        {tempPoint && isCoord(tempPoint.lat) && isCoord(tempPoint.lng) && (
          <Marker position={[tempPoint.lat, tempPoint.lng]} icon={heartIcon}>
            <Popup closeOnClick={false}>
              <motion.div
                style={st.form}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {renderFormFields(
                  tempForm,
                  setTempForm,
                  tempPhoto,
                  setTempPhoto,
                  saveNew,
                  () => {
                    setTempPoint(null);
                    setTempForm({ title: '', description: '', dateVisited: '' });
                    setTempPhoto(null);
                  }
                )}
              </motion.div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <motion.button
        whileHover={{ scale: 1.05 }}
        style={{
          marginTop: '2rem',
          padding: '0.6rem 1.2rem',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: '#f67280',
          color: '#fff',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
        onClick={() => navigate('/')}
      >
        <FaHome /> Volver a inicio
      </motion.button>
    </div>
  );
}

const st = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff0f5 0%, #ffe5ec 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5rem',
    fontFamily: 'Poppins, sans-serif'
  },
  h1: {
    color: '#ff6b6b',
    marginBottom: '1rem',
    fontSize: '2.6rem',
    fontFamily: "'Dancing Script', cursive",
    textShadow: '0 2px 4px rgba(0,0,0,0.15)'
  },
  map: {
    width: '100%',
    maxWidth: 900,
    height: 540,
    borderRadius: 20,
    border: '2px solid #ffe0ea',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
  },
  card: {
    textAlign: 'center',
    maxWidth: 240
  },
  img: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 6,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    objectFit: 'cover'
  },
  title: {
    margin: '0.2rem 0',
    color: '#e63946'
  },
  text: {
    margin: '0.2rem 0',
    fontSize: '0.9rem'
  },
  date: {
    fontSize: '0.85rem',
    color: '#555'
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.6rem',
    marginTop: 8
  },
  btnEdit: {
    background: '#ffbe0b',
    border: 'none',
    borderRadius: 6,
    padding: '0.4rem 0.6rem',
    cursor: 'pointer',
    color: '#fff'
  },
  btnDel: {
    background: '#e63946',
    border: 'none',
    borderRadius: 6,
    padding: '0.4rem 0.6rem',
    cursor: 'pointer',
    color: '#fff'
  },
  btnSave: {
    background: '#06d6a0',
    border: 'none',
    borderRadius: 6,
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 'bold'
  },
  btnCancel: {
    background: '#8d99ae',
    border: 'none',
    borderRadius: 6,
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
    color: '#fff'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    padding: '0.4rem',
    width: 240
  },
  input: {
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: '0.5rem',
    backgroundColor: '#fff9fb',
    fontSize: '0.95rem',
    outlineColor: '#fba9bc'
  },
  ta: {
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: '0.5rem',
    minHeight: 60,
    resize: 'vertical',
    backgroundColor: '#fff9fb',
    fontSize: '0.95rem',
    outlineColor: '#fba9bc'
  },
  label: {
    fontSize: '0.85rem',
    color: '#444',
    display: 'flex',
    alignItems: 'center',
    gap: 6
  }
};

export default MemoryMapPage;
