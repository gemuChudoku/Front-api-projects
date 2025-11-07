import axios from 'axios';
import { config } from '../../config/env';

const salesAPI = axios.create({
  baseURL: config.SALES_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
salesAPI.interceptors.request.use(
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
salesAPI.interceptors.response.use(
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

export const salesService = {
  // Health check de la base de datos
  healthCheck: async () => {
    const response = await salesAPI.get('/db/health');
    return response.data;
  },

  // Health check del servicio
  serviceHealth: async () => {
    const response = await salesAPI.get('/health');
    return response.data;
  },

  // Obtener ventas con información externa (users + products)
  getSalesWithExternal: async () => {
    const response = await salesAPI.get('/sales/with-external');
    return response.data;
  },

  // Obtener todas las ventas
  getAll: async () => {
    const response = await salesAPI.get('/sales');
    return response.data;
  },

  // Obtener venta por ID
  getById: async (id) => {
    const response = await salesAPI.get(`/sales/${id}`);
    return response.data;
  },

  // Crear nueva venta
  create: async (saleData) => {
    const { id, producto, cantidad, precioUnitario, cliente, vendedor, fecha } = saleData;

    if (!id || !producto || !cantidad || !precioUnitario || !cliente || !vendedor) {
      throw new Error('id, producto, cantidad, precioUnitario, cliente y vendedor son requeridos');
    }

    const response = await salesAPI.post('/sales', {
      id,
      producto,
      cantidad,
      precioUnitario,
      cliente,
      vendedor,
      fecha: fecha || new Date().toISOString()
    });
    return response.data;
  },

  // Actualizar venta
  update: async (id, saleData) => {
    const { fecha, producto, cantidad, precioUnitario, cliente, vendedor } = saleData;

    const response = await salesAPI.put(`/sales/${id}`, {
      fecha,
      producto,
      cantidad,
      precioUnitario,
      cliente,
      vendedor
    });
    return response.data;
  },

  // Eliminar venta
  delete: async (id) => {
    const response = await salesAPI.delete(`/sales/${id}`);
    return response.data;
  }
};

export default salesAPI;