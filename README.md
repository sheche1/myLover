# 💖 Aplicación Web para la Gestión de Relaciones de Pareja – **myLover**

Una plataforma privada diseñada para fortalecer el vínculo emocional entre parejas: permite compartir recuerdos, organizar tareas conjuntas y recibir recomendaciones personalizadas basadas en inteligencia artificial.

---

## 🧠 ¿Por qué esta app?

En la era digital faltan espacios dedicados a las necesidades reales de una relación. **myLover** crea ese refugio seguro, cálido y colaborativo, combinando IA, herramientas de organización y experiencias visuales para que cada pareja construya, recuerde y sueñe junta.

---

## 🌟 Funcionalidades principales

### 👫 Gestión de Perfiles  
- Creación y edición de perfiles de ambos miembros.  
- Foto de perfil, intereses y estado emocional.  

### 📅 Calendario & Línea de Tiempo  
- Contador automático de días juntos.  
- Registro y edición de aniversarios, cumpleaños y eventos clave.  
- Línea de tiempo cronológica con fotos y descripciones.

### 🖼️ Galería de Fotos  
- Subida multiformato con categorización y filtrado.  
- Eliminación y reordenado dinámico.  

### 🧾 Lista de Cosas Importantes  
- Eventos relevantes con estado (pendiente/completado).  
- Recordatorios programables.

### 🎯 Metas y Sueños  
- Objetivos compartidos con fechas límite y barra de progreso.  

### ✉️ Cartas Privadas  
- Cartas digitales con fecha de desbloqueo y contraseña opcional.  
- Bandeja de entrada/salida segura.

### 💬 Chat en Tiempo Real  
- Mensajería instantánea vía WebSockets.  
- Preguntas aleatorias y sugerencias IA integradas.

### 🗺️ Mapa de Recuerdos  
- Marcadores con foto, descripción y fecha sobre Leaflet.  

### 🤖 IA Emocional  
- Sugerencias y preguntas basadas en análisis de uso (OpenRouter API).  

### 🔒 Seguridad  
- Cifrado de datos sensibles y control de acceso por rol.

---

## 🧱 Tecnologías utilizadas

| Tecnología | Descripción |
|------------|-------------|
| **Spring Boot 3** | Backend REST modular y escalable |
| **React 18 + Vite** | Frontend SPA responsivo |
| **MySQL 8** | Almacenamiento relacional |
| **Docker & Docker Compose** | Contenedorización y despliegue |
| **Spring Security** | Autenticación y autorización |
| **OpenRouter API** | Recomendaciones emocionales IA |
| **WebSocket (STOMP)** | Chat instantáneo |
| **Leaflet** | Mapa interactivo |
| **JUnit 5 / Mockito / Jest** | Pruebas unitarias e integradas |
| **JaCoCo 0.8+** | Cobertura > 90 % en CI |

---

## ⚙️ Instalación rápida

### 🔧 Requisitos previos
- Docker Desktop (v20+)  
- Node.js 18+  
- Java 17+

### 🚀 Clonado
```bash
git clone https://github.com/tuusuario/mylover.git
cd mylover
```

**Backend**  
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend**
```bash
cd ../frontend
npm install
npm start
```