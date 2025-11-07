import axios from 'axios';
import { config } from '../../config/env';

const productsAPI = axios.create({
  baseURL: config.PRODUCTS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
productsAPI.interceptors.request.use(
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
productsAPI.interceptors.response.use(
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

export const productsService = {
  // Health check de la base de datos
  healthCheck: async () => {
    const response = await productsAPI.get('/db/health');
    return response.data;
  },

  // Health check del servicio
  serviceHealth: async () => {
    const response = await productsAPI.get('/health');
    return response.data;
  },

  // Obtener productos con información de usuarios
  getProductsWithUsers: async () => {
    const response = await productsAPI.get('/products/with-users');
    return response.data;
  },

  // Obtener todos los productos
  getAll: async () => {
    const response = await productsAPI.get('/products');
    return response.data;
  },

  // Obtener producto por ID
  getById: async (id) => {
    const response = await productsAPI.get(`/products/${id}`);
    return response.data;
  },

  // Crear nuevo producto
  create: async (productData) => {
    const { name, price, stock } = productData;
    
    if (!name || !price) {
      throw new Error('Nombre y precio son requeridos');
    }

    const response = await productsAPI.post('/products', {
      name,
      price,
      stock: stock ?? 0
    });
    return response.data;
  },

  // Actualizar producto
  update: async (id, productData) => {
    const { name, price, stock } = productData;
    
    if (!name || !price) {
      throw new Error('Nombre y precio son requeridos');
    }

    const response = await productsAPI.put(`/products/${id}`, {
      name,
      price,
      stock: stock ?? 0
    });
    return response.data;
  },

  // Eliminar producto
  delete: async (id) => {
    const response = await productsAPI.delete(`/products/${id}`);
    return response.data;
  }
};

export default productsAPI;