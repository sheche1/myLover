import React, { useState, useEffect } from 'react';
import './css/GoalsPage.css';

function GoalsPage() {
    const [goals, setGoals] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', deadline: '', completed: false });
    const [editId, setEditId] = useState(null);
  
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    const authHeader = { Authorization: `Basic ${btoa(`${email}:${password}`)}` };
  
    const fetchGoals = async () => {
      const res = await fetch('http://localhost:8080/api/goals', { headers: authHeader });
      if (res.ok) setGoals(await res.json());
    };
  
    useEffect(() => { fetchGoals(); }, []);
  
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const method = editId ? 'PUT' : 'POST';
      const url = editId
        ? `http://localhost:8080/api/goals/${editId}`
        : 'http://localhost:8080/api/goals';
  
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(form)
      });
  
      if (res.ok) {
        setForm({ title: '', description: '', deadline: '', completed: false });
        setEditId(null);
        fetchGoals();
      }
    };
  
    const handleDelete = async (id) => {
      if (!window.confirm("¿Estás seguro de eliminar esta meta?")) return;
      await fetch(`http://localhost:8080/api/goals/${id}`, { method: 'DELETE', headers: authHeader });
      fetchGoals();
    };
  
    const handleEdit = goal => {
      setForm(goal);
      setEditId(goal.id);
    };
  
    const toggleCompleted = async (goal) => {
      const updated = { ...goal, completed: !goal.completed };
      await fetch(`http://localhost:8080/api/goals/${goal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(updated)
      });
      fetchGoals();
    };
  
    const pendingGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);
    const completionRate = Math.round((completedGoals.length / goals.length) * 100 || 0);
  
    return (
      <div className="goals-container">
        <h2 className="goals-title">🎯 Metas en pareja</h2>
  
        <form onSubmit={handleSubmit} className="goals-form">
          <input
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
          <button type="submit">{editId ? 'Guardar cambios' : 'Añadir meta'}</button>
        </form>
  
        <div className="goals-progress">
          <label>Progreso:</label>
          <div className="progress-bar-background">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p>
            {completedGoals.length} de {goals.length} metas cumplidas ({completionRate}%)
          </p>
          {completionRate === 100 && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <div className="celebration-animation">
                <div className="heart">❤️</div>
                <div className="heart">💖</div>
                <div className="heart">💘</div>
                <div className="heart">💕</div>
              </div>
              <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.1rem' }}>
                🎉 ¡Felicidades! Han cumplido todas sus metas. ¡Sigan soñando juntos! 💖
              </p>
            </div>
          )}
        </div>
  
        <h3>⏳ Metas pendientes</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pendingGoals.map(goal => (
            <li key={goal.id} className="goal-item">
              <h4>{goal.title}</h4>
              <p>{goal.description}</p>
              <p><strong>Fecha límite:</strong> {goal.deadline || 'Sin definir'}</p>
              <button onClick={() => toggleCompleted(goal)}>✅ Marcar como cumplida</button>
              <button onClick={() => handleEdit(goal)}>✏️ Editar</button>
              <button onClick={() => handleDelete(goal.id)}>🗑️ Eliminar</button>
            </li>
          ))}
        </ul>
  
        <h3 style={{ marginTop: '2rem' }}>✅ Metas cumplidas</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {completedGoals.map(goal => (
            <li key={goal.id} className="goal-item completed">
              <h4>{goal.title}</h4>
              <p>{goal.description}</p>
              <p><strong>Fecha límite:</strong> {goal.deadline || 'Sin definir'}</p>
              <button onClick={() => toggleCompleted(goal)}>🔄 Marcar como pendiente</button>
              <button onClick={() => handleEdit(goal)}>✏️ Editar</button>
              <button onClick={() => handleDelete(goal.id)}>🗑️ Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default GoalsPage;