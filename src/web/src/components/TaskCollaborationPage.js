import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './css/TaskCollaborationPage.css';

export default function TaskCollaborationPage() {
  const [emailToSend, setEmailToSend] = useState('');
  const [pending, setPending] = useState([]);
  const [partners, setPartners] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', assignedTo: '' });
  const [editId, setEditId] = useState(null);

  const email = localStorage.getItem("email")?.trim().toLowerCase();
  const password = localStorage.getItem("password");
  const nombre = localStorage.getItem("nombre");
  const auth = { Authorization: "Basic " + btoa(`${email}:${password}`) };
  const navigate = useNavigate();

  const fetchPending = async () => {
    const r = await fetch("http://localhost:8080/api/task-collab/pending", { headers: auth });
    if (r.ok) setPending(await r.json());
  };

  const fetchAccepted = async () => {
    const r = await fetch("http://localhost:8080/api/task-collab/accepted", { headers: auth });
    if (r.ok) {
      const users = await r.json();
      const all = [
        { email: email, nombre: nombre || email },
        ...users.map(u => ({
          email: u.email.trim().toLowerCase(),
          nombre: u.nombre
        }))
      ];
      const unique = Array.from(new Map(all.map(user => [user.email, user])).values());
      setPartners(unique);
    }
  };

  const fetchTasks = async () => {
    const r = await fetch("http://localhost:8080/api/tasks", { headers: auth });
    if (r.ok) setTasks(await r.json());
  };

  useEffect(() => {
    fetchPending();
    fetchAccepted();
    fetchTasks();
  }, []);

  const sendRequest = async () => {
    if (!emailToSend.trim()) return;
    const r = await fetch(`http://localhost:8080/api/task-collab/send?receiverEmail=${emailToSend}`, {
      method: "POST",
      headers: auth
    });
    if (r.ok) {
      alert("Solicitud enviada");
      setEmailToSend('');
      fetchPending();
    } else {
      alert("No se pudo enviar");
    }
  };

  const acceptRequest = async (id) => {
    const r = await fetch(`http://localhost:8080/api/task-collab/accept?requestId=${id}`, {
      method: "POST",
      headers: auth
    });
    if (r.ok) {
      alert("Solicitud aceptada");
      fetchPending();
      fetchAccepted();
    }
  };

  const saveTask = async (e) => {
    e.preventDefault();
    const url = editId ? `http://localhost:8080/api/tasks/${editId}` : 'http://localhost:8080/api/tasks';
    const method = editId ? 'PUT' : 'POST';
    const body = {
      ...form,
      assignedTo: { email: form.assignedTo }
    };
    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify(body)
    });
    if (r.ok) {
      setForm({ title: '', description: '', dueDate: '', assignedTo: '' });
      setEditId(null);
      fetchTasks();
    }
  };

  const toggleTask = async (t) => {
    await fetch(`http://localhost:8080/api/tasks/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify({ ...t, completed: !t.completed, assignedTo: t.assignedTo })
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: 'DELETE',
      headers: auth
    });
    fetchTasks();
  };

  return (
    <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <h2 className="collab-title"><span className="emoji">🤝</span> Colaboraciones de tareas</h2>

      <section className="section send-request-box">
        <h4>Enviar solicitud</h4>
        <div className="send-request-form">
          <input
            className="input email-input"
            placeholder="Correo del otro usuario"
            value={emailToSend}
            onChange={(e) => setEmailToSend(e.target.value)}
          />
          <button className="button send-button" onClick={sendRequest}>Enviar</button>
        </div>
      </section>

      <section className="section pending-requests-box">
        <h4>Solicitudes pendientes</h4>
        {pending.length === 0 ? (
          <p className="empty-text">No tienes solicitudes pendientes.</p>
        ) : (
          <ul className="pending-list">
            {pending.map((r) => (
              <li key={r.id} className="pending-item">
                <span>{r.requester.nombre || r.requester.email}</span>
                <button className="accept-button" onClick={() => acceptRequest(r.id)}>Aceptar</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="section">
        <h4>Colaboradores activos</h4>
        {partners.length === 0 && <p>No hay colaboradores.</p>}
        <ul>
          {partners.map((p, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              {p.email === email ? nombre : (p.nombre || p.email)}
            </motion.li>
          ))}
        </ul>
      </section>

      <h2 className="title">📋 Tareas compartidas</h2>

      <div className="task-form-box">
        <form onSubmit={saveTask} className="task-form">
          <input className="input" placeholder="Título" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input" placeholder="Descripción" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <select className="select" required value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
            <option value="">Asignar a...</option>
            {partners.map((p) => (
              <option key={p.email} value={p.email}>
                {p.email === email ? nombre : (p.nombre || p.email)}
              </option>
            ))}
          </select>
          <button className="button">{editId ? 'Guardar' : 'Añadir'}</button>
        </form>
      </div>

      <ul className="tasks-list">
        {tasks.map((t) => (
          <li key={t.id} className={`task-card ${t.completed ? 'done' : ''}`}>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <p>📅 {t.dueDate}</p>
            <p><strong>Asignada a:</strong> {t.assignedTo?.nombre || t.assignedTo?.email}</p>
            <div className="task-buttons">
              <button onClick={() => toggleTask(t)}>✔️ {t.completed ? 'Pendiente' : 'Hecha'}</button>
              <button onClick={() => {
                setForm({
                  title: t.title,
                  description: t.description,
                  dueDate: t.dueDate,
                  assignedTo: t.assignedTo.email
                });
                setEditId(t.id);
              }}>✏️ Editar</button>
              <button onClick={() => deleteTask(t.id)}>🗑️ Eliminar</button>
            </div>
          </li>
        ))}
      </ul>

      <button className="back-button-red" onClick={() => navigate('/')}>Volver al Inicio</button>
    </motion.div>
  );
}
