export const config = {
  USERS_API_URL: import.meta.env.VITE_USERS_API_URL || 'http://localhost:4001',
  PRODUCTS_API_URL: import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:4002',
  SALES_API_URL: import.meta.env.VITE_SALES_API_URL || 'http://localhost:4003',
  REFUNDS_API_URL: import.meta.env.VITE_REFUNDS_API_URL || 'http://localhost:4004',
  IS_PRODUCTION: import.meta.env.VITE_PRODUCTION === 'true'
};