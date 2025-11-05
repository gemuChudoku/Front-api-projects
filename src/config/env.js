export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  USERS_API_URL: import.meta.env.VITE_USERS_API_URL,
  IS_PRODUCTION: import.meta.env.VITE_PRODUCTION === 'true'
};