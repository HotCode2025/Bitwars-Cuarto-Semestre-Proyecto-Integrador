import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import PaymentResult from './pages/PaymentResult';
import ProductDetail from './pages/ProductDetail';
import SplashScreen from './components/SplashScreen'; 
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

function AdminRoute({ children }) {
  const { isAdmin, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <div className="text-center mt-20 font-bold text-red-600 text-xl">Acceso denegado</div>;
  return children;
}

function App() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();

  const [showSplash, setShowSplash] = useState(() => {
    if (window.location.pathname.includes('/pago-')) return false;
    if (sessionStorage.getItem('bitwars_splash_seen')) return false;
    return true;
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem('bitwars_splash_seen', '1');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} duration={12000} />}

      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        {/* NAVBAR RESPONSIVE */}
        <nav className="bg-slate-900 text-white px-4 md:px-6 py-3 flex justify-between items-center shadow-md sticky top-0 z-40">
          <Link to="/" className="text-lg md:text-2xl font-extrabold tracking-wider hover:opacity-90 transition-opacity">
            BITWARS <span className="text-green-500">SPORTS</span>
          </Link>

          <div className="flex gap-3 md:gap-6 items-center">
            <Link to="/" className="hidden md:block text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Tienda
            </Link>

            {isAdmin && (
              <Link to="/admin" className="text-xs md:text-sm font-semibold text-green-400 hover:text-green-300 transition-colors flex items-center gap-1">
                Admin
              </Link>
            )}

            <Link to="/carrito" className="relative p-1.5 md:p-2 text-slate-300 hover:text-green-400 transition-colors" aria-label="Carrito">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center translate-x-1/4 -translate-y-1/4 border-2 border-slate-900">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <button onClick={logout} className="text-xs md:text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                Salir
              </button>
            ) : (
              <Link to="/login" className="text-xs md:text-sm font-semibold text-white bg-green-600 px-3 py-1.5 md:px-5 md:py-2 rounded-lg hover:bg-green-500 transition-all shadow-md">
                Ingresar
              </Link>
            )}
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/pago-exitoso" element={<PaymentResult />} />
            <Route path="/pago-fallido" element={<PaymentResult />} />
            <Route path="/pago-pendiente" element={<PaymentResult />} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Routes>
        </main>

        <footer className="bg-slate-800 text-slate-400 text-center p-4 text-xs md:text-sm">
          &copy; 2026 Grupo Bitwars - UTN San Rafael
        </footer>
      </div>
    </>
  );
}

export default App;