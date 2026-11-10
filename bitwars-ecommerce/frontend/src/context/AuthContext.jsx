import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

/**
 * Grupo Bitwars
 * AuthContext
 *
 * ⚠️ CORRECCIÓN APLICADA:
 * El `decodeToken` ahora agrega el padding base64 necesario antes de `atob`.
 * Sin eso, algunos JWT (cuyo segmento payload no tiene longitud múltiplo de 4)
 * fallan con "InvalidCharacterError" y el usuario queda sin rol.
 */
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    // base64url → base64 estándar
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Padding: base64 necesita longitud múltiplo de 4
    const pad = base64.length % 4;
    if (pad === 2) base64 += '==';
    else if (pad === 3) base64 += '=';
    else if (pad === 1) return null; // payload inválido

    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch (error) {
    console.warn('⚠️ No se pudo decodificar el token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const decoded = decodeToken(token);
      if (decoded) {
        setUsuario({
          email: decoded.sub || null,
          autoridad: decoded.autoridad || null,
        });
        const rolNormalizado = decoded.autoridad
          ? decoded.autoridad.replace('ROLE_', '')
          : 'CLIENTE';
        setRol(rolNormalizado);
      }
    } else {
      localStorage.removeItem('token');
      setUsuario(null);
      setRol(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Error al iniciar sesión',
      };
    }
  };

  const register = async (datos) => {
    try {
      const { data } = await api.post('/auth/register', datos);
      setToken(data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Error al registrarse',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    setRol(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        rol,
        isAuthenticated: !!token,
        isAdmin: rol === 'ADMIN',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};