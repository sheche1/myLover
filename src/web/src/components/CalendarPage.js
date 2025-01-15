import React from 'react';
import RelationshipCalendar from './RelationshipCalendar'; // Importamos el calendario

function CalendarPage() {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                ❤️ Calendario de Nuestra Relación ❤️
            </h1>
            <div style={styles.calendarBox}>
                <RelationshipCalendar />
            </div>
            <p style={styles.footerText}>
                💕 Cada día contigo es especial 💕
            </p>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #ff9a9e, #fad0c4)', // Fondo degradado romántico
        fontFamily: "'Poppins', sans-serif",
        padding: '20px',
    },
    title: {
        marginBottom: '20px',
        color: '#ff6b6b',
        fontSize: '32px',
        fontWeight: 'bold',
        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
    },
    calendarBox: {
        background: 'linear-gradient(to bottom right, #fff, #ffe6e6)', // Fondo degradado en la caja
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
        position: 'relative',
    },
    footerText: {
        marginTop: '20px',
        fontSize: '16px',
        color: '#ff6b6b',
        fontWeight: 'bold',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
    },
};

export default CalendarPage;
