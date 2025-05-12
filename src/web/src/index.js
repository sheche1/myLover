import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const backend =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080'                
    : 'https://myloverr.onrender.com';     

const realFetch = window.fetch;
window.fetch = (url, opts = {}) => {
  if (typeof url === 'string') {
    if (url.startsWith('/api/')) {
      return realFetch(backend + url, opts);
    }
    if (url.startsWith('http://localhost:8080')) {
      return realFetch(url.replace('http://localhost:8080', backend), opts);
    }
  }
  return realFetch(url, opts);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

<link
  href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
  rel="stylesheet"
/>

reportWebVitals();
