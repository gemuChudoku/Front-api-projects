import axios from 'axios';
import { config } from '../../config/env';

const usersAPI = axios.create({
  baseURL: config.USERS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
usersAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
usersAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const usersService = {
  // Health check de la base de datos
  healthCheck: async () => {
    const response = await usersAPI.get('/db/health');
    return response.data;
  },

  // Health check del servicio
  serviceHealth: async () => {
    const response = await usersAPI.get('/health');
    return response.data;
  },

  // Obtener todos los usuarios
  getAll: async () => {
    const response = await usersAPI.get('/users');
    return response.data;
  },

  // Obtener usuario por ID
  getById: async (id) => {
    const response = await usersAPI.get(`/users/${id}`);
    return response.data;
  },

  // Crear usuario (sin password)
  create: async (userData) => {
    const { name, email } = userData;
    
    if (!name || !email) {
      throw new Error('Nombre y email son requeridos');
    }

    const response = await usersAPI.post('/users', {
      name,
      email
    });
    return response.data;
  },

  // Actualizar usuario
  update: async (id, userData) => {
    const { name, email } = userData;
    
    if (!name || !email) {
      throw new Error('Nombre y email son requeridos');
    }

    const response = await usersAPI.put(`/users/${id}`, {
      name,
      email
    });
    return response.data;
  },

  // Eliminar usuario
  delete: async (id) => {
    const response = await usersAPI.delete(`/users/${id}`);
    return response.data;
  }
};

// Servicio de autenticación
export const authAPI = {
  login: async (credentials) => {
    const response = await usersAPI.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await usersAPI.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await usersAPI.get('/auth/me');
    return response.data;
  }
};

export default usersAPI;