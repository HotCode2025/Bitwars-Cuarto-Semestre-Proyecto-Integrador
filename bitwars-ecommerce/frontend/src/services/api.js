import axios from 'axios';

// Usa la variable de entorno si existe, sino la URL de Render en producción
// (Si estás en local, podés crear un archivo .env con VITE_API_URL=http://localhost:8080/api)
const API_URL = import.meta.env.VITE_API_URL || 'https://bitwars-backend-latest.onrender.com/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  // 👇 60 segundos de espera para que Render arranque si estaba dormido
  timeout: 60000, 
});

// Interceptor de request: agrega el token JWT si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response: avisa en consola si hay errores de permisos
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('⚠️ Petición rechazada:', error.response.data);
    }
    return Promise.reject(error);
  }
);