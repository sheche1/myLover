# 💖 Aplicación Web para la Gestión de Relaciones de Pareja

Una plataforma pensada para fortalecer el vínculo emocional entre parejas, permitiéndoles compartir recuerdos, gestionar eventos importantes, y recibir recomendaciones personalizadas basadas en inteligencia artificial.

## 🧠 ¿Por qué esta app?

En el mundo digital actual, las parejas a menudo carecen de un espacio íntimo donde construir, recordar y soñar juntos. Esta aplicación ofrece una solución digital segura, emocional y personalizada, centrada exclusivamente en fortalecer las relaciones afectivas.

---

## 🌟 Funcionalidades principales

### 👫 Gestión de Perfiles (myLover)
- Crear y editar perfiles de cada miembro de la pareja.
- Subida de fotos de perfil y personalización de intereses.

### 📅 Calendario de Relación
- Contador de días desde el inicio de la relación.
- Agrega y visualiza fechas importantes (aniversarios, cumpleaños, etc.).

### 🖼️ Galería de Fotos
- Subida, clasificación y eliminación de imágenes.
- Visualización en formato de galería con categorías.

### 🧾 Lista de Cosas Importantes
- Registro de eventos clave y objetivos compartidos.
- Marca eventos como cumplidos o pendientes.

### 🎯 Metas y Sueños
- Define y realiza seguimiento a metas comunes.
- Estado de progreso y fechas límite.

### ✉️ Cartas y Mensajes Privados
- Espacio para escribir mensajes íntimos.
- Visualización organizada y segura.

### 🕰️ Línea de Tiempo
- Visualiza cronológicamente los hitos de la relación.

### 📍 Mapa de Recuerdos
- Marca ubicaciones significativas con fotos y descripciones.
- Integración con Google Maps.

### 🤖 IA Emocional (Próximamente)
- Recomendaciones personalizadas basadas en el análisis emocional.
- Interacción con una API externa de inteligencia artificial.

---

## 🧱 Tecnologías utilizadas

| Tecnología | Descripción |
|------------|-------------|
| **Spring Boot** | Backend en Java con arquitectura REST segura. |
| **React** | Frontend dinámico, responsivo y modular. |
| **MySQL** | Gestión de base de datos relacional. |
| **Docker** | Contenedorización para facilitar despliegue. |
| **JWT + Spring Security** | Seguridad, autenticación y control de acceso. |
| **TensorFlow.js & scikit-learn** | Análisis emocional mediante IA (API externa). |
| **GitHub + Git** | Control de versiones y trabajo colaborativo. |

---

## ⚙️ Instalación y despliegue rápido

### 🔧 Requisitos
- Node.js
- Docker + Docker Compose
- Java 17+
- MySQL 8+

### 🚀 Pasos
```bash
git clone https://github.com/tuusuario/nombre-repo.git
cd nombre-repo

# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm start
