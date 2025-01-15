import React, { useState, useEffect } from 'react';

function RelationshipCalendar() {
    const [knownDays, setKnownDays] = useState(0);
    const initialDate = new Date('2023-04-15'); // Cambia la fecha aquí si es necesario

    useEffect(() => {
        const calculateDays = () => {
            const now = new Date();
            const timeDifference = now - initialDate;
            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            setKnownDays(daysDifference);
        };
        calculateDays();
    }, []);

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    return (
        <div style={styles.container}>
            <div style={styles.hearts}>💖 💕 💗 💓 💞</div>
            <p style={styles.date}>{formatDate(new Date())}</p>
            <p style={styles.message}>
                Ya hemos conocido <span style={styles.highlight}>{knownDays}</span> días 💘
            </p>
            <div style={styles.heartsBottom}>💖 💕 💗 💓 💞</div>
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

export default RelationshipCalendar;
