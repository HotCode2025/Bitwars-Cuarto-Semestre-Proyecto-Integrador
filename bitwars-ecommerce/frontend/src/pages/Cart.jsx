import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useState, useEffect } from 'react';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrecio } = useCart();
  const { isAuthenticated, usuario } = useAuth();
  const navigate = useNavigate();
  
  const [procesando, setProcesando] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); 
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    let interval;
    if (procesando) {
      setProgreso(0);
      interval = setInterval(() => {
        setProgreso((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.floor(Math.random() * 10) + 5;
        });
      }, 200);
    } else {
      setProgreso(0);
    }
    return () => clearInterval(interval);
  }, [procesando]);

  const handleCheckout = async () => {
    if (!isAuthenticated || !usuario?.email) {
      setShowAuthModal(true);
      return;
    }

    setProcesando(true);
    try {
      const response = await api.post('/pagos/crear-preferencia', {
        emailUsuario: usuario.email,
        items: items.map(item => ({
          id: item.id, 
          nombre: item.nombre, 
          cantidad: item.cantidad,
          precio: Number(item.precio),
          talle: item.talle
        }))
      });

      setProgreso(100);
      setTimeout(() => {
        window.location.href = response.data;
      }, 400);

    } catch (error) {
      console.error("Error al iniciar pago:", error);
      alert("No se pudo conectar con Mercado Pago. Revisá la consola.");
      setProcesando(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h1 className="text-2xl font-bold text-slate-700">Tu carrito está vacío</h1>
        <Link to="/" className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition">Ver catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 relative">
      
      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Carrito de Compras</h1>
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 transition-colors bg-green-50 px-4 py-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Seguir comprando
        </Link>
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="space-y-4">
        {items.map(item => (
          <div 
            key={item.cartItemId} 
            className="group flex flex-col sm:flex-row items-center gap-4 md:gap-6 bg-white p-4 md:p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300"
          >
            
            {/* 👇 IMAGEN MÁS GRANDE Y LLAMATIVA 👇 */}
            <div className="w-32 h-32 md:w-36 md:h-36 flex-shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 p-2 flex items-center justify-center relative">
              {item.imagenPrincipal ? (
                <img 
                  src={item.imagenPrincipal} 
                  alt={item.nombre} 
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
                />
              ) : (
                <span className="text-sm text-slate-400 text-center font-medium">Sin foto</span>
              )}
            </div>

            {/* INFO DEL PRODUCTO */}
            <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0">
              <span className="text-xs font-bold text-green-600 tracking-wider uppercase mb-1 block">
                {item.categoria}
              </span>
              <h3 className="font-bold text-slate-900 text-lg md:text-xl leading-tight">
                {item.nombre}
              </h3>
              {item.talle && (
                <p className="text-sm font-semibold text-slate-500 mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded-md">
                  Talle: <span className="text-slate-800">{item.talle}</span>
                </p>
              )}
              <p className="text-base font-bold text-slate-800 mt-2">
                ${Number(item.precio).toLocaleString('es-AR')}
              </p>
            </div>

            {/* CONTROLES DE CANTIDAD Y SUBTOTAL */}
            <div className="flex flex-col items-center sm:items-end gap-3 min-w-[120px]">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-1">
                <button 
                  onClick={() => updateQuantity(item.cartItemId, item.cantidad - 1)} 
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 hover:bg-slate-100 transition font-bold text-slate-600"
                >
                  −
                </button>
                <span className="font-bold text-slate-800 w-4 text-center">{item.cantidad}</span>
                <button 
                  onClick={() => updateQuantity(item.cartItemId, item.cantidad + 1)} 
                  disabled={item.cantidad >= item.stock} 
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 hover:bg-slate-100 transition font-bold text-slate-600 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              
              <div className="text-xl font-extrabold text-slate-900">
                ${(Number(item.precio) * item.cantidad).toLocaleString('es-AR')}
              </div>
            </div>

            {/* BOTÓN ELIMINAR */}
            <button 
              onClick={() => removeItem(item.cartItemId)} 
              className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors sm:ml-2" 
              title="Eliminar producto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* PIE DE PÁGINA */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 pt-6 gap-4">
        <div className="flex gap-4 items-center">
          <button onClick={clearCart} className="text-red-600 text-sm font-semibold hover:underline">Vaciar carrito</button>
          <span className="text-slate-300">|</span>
          <Link to="/" className="text-slate-500 text-sm font-semibold hover:text-slate-800 hover:underline transition-colors">Agregar más productos</Link>
        </div>
        <div className="text-3xl font-extrabold text-slate-900">
          Total: <span className="text-green-600">${totalPrecio.toLocaleString('es-AR')}</span>
        </div>
      </div>

      {/* BOTÓN ANIMADO */}
      <button 
        onClick={handleCheckout}
        disabled={procesando}
        className={`mt-6 w-full relative overflow-hidden py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-3 text-white text-lg ${
            procesando ? 'bg-slate-900 cursor-wait shadow-inner' : 'bg-[#009EE3] hover:bg-[#008FCC] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
        }`}
      >
        {procesando && (
          <div 
            className="absolute left-0 top-0 bottom-0 bg-[#009EE3] transition-all duration-200 ease-out z-0"
            style={{ width: `${progreso}%` }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_1.5s_infinite]"></div>
          </div>
        )}

        <span className="relative z-10 flex items-center gap-2">
          {procesando ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Conectando con Mercado Pago...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Pagar con Mercado Pago
            </>
          )}
        </span>
      </button>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* MODAL DE AUTENTICACIÓN */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 p-6 flex flex-col items-center border-b border-slate-100">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Iniciá sesión para continuar</h2>
              <p className="text-sm text-slate-500 text-center mt-2">Para poder procesar tu pago de forma segura y asociar tu compra, necesitamos que ingreses a tu cuenta.</p>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <button onClick={() => navigate('/login')} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-md">Ir a Iniciar Sesión</button>
              <button onClick={() => setShowAuthModal(false)} className="w-full bg-white text-slate-600 font-semibold py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition">Seguir mirando la tienda</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}