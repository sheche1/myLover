import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RelationshipCalendar() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [firstDay, setFirstDay] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
          try {
          
            const email = localStorage.getItem('email');
            const password = localStorage.getItem('password');
    
            const response = await fetch('http://localhost:8080/api/profile', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${email}:${password}`)
              }
            });
            if (!response.ok) {
              throw new Error('No se pudo obtener los datos');
            }
            const data = await response.json();
            setUserData(data);
            setFirstDay(new Date(data.fechaPrimerEncuentro));
          } catch (err) {
            console.error(err);
            setError('Error al cargar los datos');
          }
        };
        fetchProfile();
      }, []);
    
    const [knownDays, setKnownDays] = useState(0);
    
    useEffect(() => {
        if (firstDay){
        const calculateDays = () => {
            const now = new Date();
            const timeDifference = now - firstDay;
            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            setKnownDays(daysDifference);
        };
        calculateDays();
    }
    }, [firstDay]);

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.hearts}>💖 💕 💗 💓 💞</div>
            <p style={styles.date}>{formatDate(new Date())}</p>
            <p style={styles.message}>
                Ya hemos conocido <span style={styles.highlight}>{knownDays}</span> días 💘
            </p>
            <div style={styles.heartsBottom}>💖 💕 💗 💓 💞</div>
            <button 
             style={buttonStyle}
             onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
             onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
            onClick={() => navigate("/")} >Volver al HomePage</button>
        </div>
    );
}

const styles = {
    container: {
        textAlign: 'center',
        color: '#333',
        fontFamily: "'Poppins', sans-serif",
        position: 'relative',
    },
    hearts: {
        fontSize: '20px',
        marginBottom: '10px',
    },
    date: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#444',
    },
    message: {
        fontSize: '20px',
        color: '#555',
    },
    highlight: {
        color: '#ff6b6b',
        fontWeight: 'bold',
    },
    heartsBottom: {
        fontSize: '20px',
        marginTop: '10px',
    },
};
const buttonStyle = {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
};

   
const buttonHoverStyle = {
    backgroundColor: '#ff8787',
};
export default RelationshipCalendar;
