import axios from 'axios';
import { config } from '../../config/env';

const refundsAPI = axios.create({
  baseURL: config.REFUNDS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
refundsAPI.interceptors.request.use(
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
refundsAPI.interceptors.response.use(
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

export const refundsService = {
  // Health check de la base de datos
  healthCheck: async () => {
    const response = await refundsAPI.get('/db/health');
    return response.data;
  },

  // Health check del servicio
  serviceHealth: async () => {
    const response = await refundsAPI.get('/health');
    return response.data;
  },

  // Obtener todos los reembolsos
  getAll: async () => {
    const response = await refundsAPI.get('/refunds');
    return response.data;
  },

  // Obtener reembolso por ID
  getById: async (id) => {
    const response = await refundsAPI.get(`/refunds/${id}`);
    return response.data;
  },

  // Crear nuevo reembolso
  create: async (refundData) => {
    const { 
      sale_id, 
      product_name, 
      client_name, 
      seller_id, 
      quantity, 
      unit_price, 
      total_amount, 
      reason, 
      status = 'pending' 
    } = refundData;

    // Validar campos requeridos según tu API
    if (!sale_id || !product_name || !client_name || !seller_id || 
        !quantity || !unit_price || !total_amount || !reason) {
      throw new Error('sale_id, product_name, client_name, seller_id, quantity, unit_price, total_amount y reason son requeridos');
    }

    const response = await refundsAPI.post('/refunds', {
      sale_id,
      product_name,
      client_name,
      seller_id,
      quantity,
      unit_price,
      total_amount,
      reason,
      status
    });
    return response.data;
  },

  // Actualizar reembolso
  update: async (id, refundData) => {
    const { 
      sale_id, 
      product_name, 
      client_name, 
      seller_id, 
      quantity, 
      unit_price, 
      total_amount, 
      reason, 
      status 
    } = refundData;

    // Validar campos requeridos según tu API
    if (!sale_id || !product_name || !client_name || !seller_id || 
        !quantity || !unit_price || !total_amount || !reason || !status) {
      throw new Error('Todos los campos son requeridos');
    }

    const response = await refundsAPI.put(`/refunds/${id}`, {
      sale_id,
      product_name,
      client_name,
      seller_id,
      quantity,
      unit_price,
      total_amount,
      reason,
      status
    });
    return response.data;
  },

  // Eliminar reembolso
  delete: async (id) => {
    const response = await refundsAPI.delete(`/refunds/${id}`);
    return response.data;
  }
};

export default refundsAPI;