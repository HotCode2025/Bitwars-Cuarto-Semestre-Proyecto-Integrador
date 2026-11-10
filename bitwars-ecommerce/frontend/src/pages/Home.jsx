import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductos } from '../context/ProductosContext';
import { useCart } from '../context/CartContext';
import Product360View from '../components/Product360View';

export default function Home() {
  const { productos, cargando, error, refetch } = useProductos();
  const { addItem } = useCart();
  const [feedback, setFeedback] = useState({});
  const navigate = useNavigate();

  const handleAgregar = (e, producto) => {
    e.preventDefault();
    if (producto.talles && producto.talles.length > 0) {
      navigate(`/producto/${producto.id}`);
      return;
    }
    const result = addItem(producto);
    if (result.success) {
      setFeedback(prev => ({ ...prev, [producto.id]: '¡Agregado!' }));
      setTimeout(() => setFeedback(prev => ({ ...prev, [producto.id]: null })), 1500);
    }
  };

  if (cargando) return <div className="flex justify-center items-center h-[60vh]"><p className="text-xl text-slate-600 animate-pulse">Cargando catálogo...</p></div>;
  if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 md:mb-8 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Catálogo</h1>
        <button onClick={refetch} className="text-sm text-slate-500 hover:text-slate-800 transition">🔄 Actualizar</button>
      </div>

      {productos.length === 0 ? (
        <p className="text-slate-500 text-center text-lg mt-10">No hay productos cargados todavía.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {productos.map(producto => (
            <Link to={`/producto/${producto.id}`} key={producto.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col group">
              <div className="flex justify-center items-center h-[250px] md:h-[300px] p-4 bg-slate-50">
                {producto.imagen360 ? (
                  <Product360View imageUrl={producto.imagen360} width={250} height={250} />
                ) : producto.imagenPrincipal ? (
                  <img src={producto.imagenPrincipal} alt={producto.nombre} className="w-full h-full object-contain transition-transform group-hover:scale-105" />
                ) : (
                  <div className="text-slate-400">Sin imagen</div>
                )}
              </div>

              <div className="p-4 md:p-6 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-green-600 uppercase">{producto.categoria}</span>
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 mt-1 group-hover:text-green-600 transition-colors line-clamp-2">{producto.nombre}</h2>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl md:text-2xl font-bold text-slate-900">${Number(producto.precio).toLocaleString('es-AR')}</span>
                  <span className="text-xs md:text-sm text-slate-500">Stock: {producto.stock}</span>
                </div>
                <button onClick={(e) => handleAgregar(e, producto)} disabled={producto.stock <= 0} className={`mt-4 w-full font-bold py-2 rounded-lg transition text-sm md:text-base ${producto.stock <= 0 ? 'bg-slate-300 text-slate-500' : feedback[producto.id] ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                  {producto.stock <= 0 ? 'Sin stock' : feedback[producto.id] || (producto.talles?.length > 0 ? 'Elegir talle' : 'Agregar al Carrito')}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}