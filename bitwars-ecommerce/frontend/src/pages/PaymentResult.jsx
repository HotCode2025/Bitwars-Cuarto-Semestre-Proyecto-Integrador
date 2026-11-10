import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function PaymentResult() {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate(); // 👈 Importamos useNavigate
  const path = location.pathname;
  const [tiempoRestante, setTiempoRestante] = useState(5);

  useEffect(() => {
    // Si el pago fue exitoso, limpiamos el carrito
    if (path === '/pago-exitoso') {
      clearCart();
    }
  }, [path, clearCart]);

  useEffect(() => {
    // 👇 Si el tiempo llega a 0, redirigimos (FUERA del setState)
    if (tiempoRestante <= 0) {
      try {
        // Guardamos en sessionStorage con try/catch por si el navegador lo bloquea
        sessionStorage.setItem('bitwars_splash_seen', '1');
      } catch (error) {
        console.warn("No se pudo guardar en sessionStorage", error);
      }
      
      // Usamos navigate en lugar de window.location.href
      navigate('/', { replace: true });
      return;
    }

    // Si no es 0, configuramos el temporizador para el próximo segundo
    const timer = setTimeout(() => {
      setTiempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [tiempoRestante, navigate]);

  const getConfig = () => {
    switch (path) {
      case '/pago-exitoso':
        return { icon: '✅', title: '¡Pago Exitoso!', color: 'text-green-600', msg: 'Tu compra ha sido procesada correctamente. ¡Gracias por elegir Bitwars!' };
      case '/pago-fallido':
        return { icon: '❌', title: 'Pago Rechazado', color: 'text-red-600', msg: 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.' };
      default:
        return { icon: '⏳', title: 'Pago Pendiente', color: 'text-amber-500', msg: 'Tu pago está siendo procesado. Te notificaremos cuando se acredite.' };
    }
  };

  const config = getConfig();

  const getBarColor = () => {
    if (tiempoRestante > 3) return 'bg-green-500'; 
    if (tiempoRestante > 1) return 'bg-amber-500'; 
    return 'bg-red-500';                           
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4 text-center">
      <div className="text-6xl animate-bounce">{config.icon}</div>
      
      <h1 className={`text-3xl font-bold ${config.color}`}>{config.title}</h1>
      
      <p className="text-slate-600 max-w-md">{config.msg}</p>
      
      <div className="mt-8 flex flex-col items-center w-full max-w-sm">
        <p className="text-sm font-semibold text-slate-500 mb-3">
          Volviendo a la tienda automáticamente en <span className="text-slate-800 font-bold">{tiempoRestante}</span> segundos...
        </p>
        
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ease-linear ${getBarColor()}`}
            style={{ width: `${(tiempoRestante / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}