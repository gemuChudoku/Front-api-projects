import axios from 'axios';

// Las variables en Vite deben prefijarse con VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const USERS_API_URL = import.meta.env.VITE_USERS_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: USERS_API_URL || API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... el resto del código del api service