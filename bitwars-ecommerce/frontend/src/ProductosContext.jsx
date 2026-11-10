/*
 * Grupo Bitwars
 * ProductosContext: fuente única de verdad del catálogo.
 * Home y Admin leen de acá, así los cambios se reflejan al instante.
 */
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const ProductosContext = createContext();
export const useProductos = () => useContext(ProductosContext);

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Trae el catálogo desde el backend
  const refetch = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await api.get('/productos');
      setProductos(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Error al cargar el catálogo'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    refetch();
  }, [refetch]);

  // --- Mutadores locales: los llama el Admin tras cada operación ---
  const addLocal = useCallback((producto) => {
    setProductos(prev => [producto, ...prev]);
  }, []);

  const updateLocal = useCallback((producto) => {
    setProductos(prev => prev.map(p => (p.id === producto.id ? producto : p)));
  }, []);

  const removeLocal = useCallback((id) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <ProductosContext.Provider
      value={{
        productos,
        cargando,
        error,
        refetch,
        addLocal,
        updateLocal,
        removeLocal,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
};