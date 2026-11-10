import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const STORAGE_KEY = 'bitwars_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Recibimos el producto, la cantidad (por defecto 1) y el talle (por defecto null)
  const addItem = (producto, cantidad = 1, talle = null) => {
    if (!producto || producto.stock <= 0) return { success: false };

    // Creamos un ID único para el carrito combinando el ID del producto y el talle
    // Ejemplo: "15-S" o "15-null" (si no tiene talle)
    const cartItemId = talle ? `${producto.id}-${talle}` : `${producto.id}`;

    setItems(prev => {
      const existente = prev.find(i => i.cartItemId === cartItemId);
      if (existente) {
        // Si ya existe ese mismo producto con ese mismo talle, sumamos cantidad
        const nuevaCantidad = Math.min(existente.cantidad + cantidad, producto.stock);
        return prev.map(i =>
          i.cartItemId === cartItemId ? { ...i, cantidad: nuevaCantidad } : i
        );
      }
      // Si es nuevo (o es el mismo producto pero distinto talle), lo agregamos
      return [...prev, { ...producto, cartItemId, talle, cantidad: Math.min(cantidad, producto.stock) }];
    });

    return { success: true };
  };

  const removeItem = (cartItemId) => setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  
  const updateQuantity = (cartItemId, cantidad) => {
    if (cantidad <= 0) return removeItem(cartItemId);
    setItems(prev => prev.map(i => i.cartItemId !== cartItemId ? i : { ...i, cantidad: Math.min(cantidad, i.stock) }));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
  const totalPrecio = items.reduce((sum, i) => sum + Number(i.precio) * i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrecio }}>
      {children}
    </CartContext.Provider>
  );
};