import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductos } from '../context/ProductosContext';
import { useCart } from '../context/CartContext';
import Product360View from '../components/Product360View';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos, cargando } = useProductos();
  const { addItem } = useCart();

  const [producto, setProducto] = useState(null);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(null);
  const [feedback, setFeedback] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (productos.length > 0) {
      const prod = productos.find(p => p.id === parseInt(id));
      if (prod) {
        setProducto(prod);
        setImagenActiva(prod.galeriaImagenes?.length > 0 ? prod.galeriaImagenes[0] : prod.imagenPrincipal);
        if (prod.talles?.length === 1) setTalleSeleccionado(prod.talles[0]);
      }
    }
  }, [id, productos]);

  if (cargando) return <div className="text-center mt-20 text-xl animate-pulse">Cargando...</div>;
  if (!producto) return <div className="text-center mt-20 text-xl text-red-500">Producto no encontrado</div>;

  const handleAgregar = () => {
    if (producto.talles?.length > 0 && !talleSeleccionado) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
      return;
    }
    const result = addItem(producto, 1, talleSeleccionado);
    if (result.success) {
      setFeedback(true);
      setTimeout(() => setFeedback(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 relative">
      
      {/* Toast */}
      <div className={`fixed top-24 right-4 md:right-6 z-50 bg-white border-l-4 border-red-500 text-slate-800 p-3 md:p-4 rounded shadow-2xl flex items-center gap-3 transition-all duration-300 ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'}`}>
        <div className="bg-red-100 text-red-500 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
        </div>
        <div>
          <p className="font-bold text-sm">Falta el talle</p>
          <p className="text-xs text-slate-500">Por favor, seleccioná tu talle.</p>
        </div>
      </div>

      <div className="mb-4 md:mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Volver al catálogo
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Imágenes */}
        <div className="md:w-1/2 p-4 md:p-8 bg-slate-50 flex flex-col items-center">
          <div className="w-full max-w-md aspect-square bg-white rounded-xl shadow-sm p-2 md:p-4 flex items-center justify-center mb-4 border border-slate-100 relative">
            {imagenActiva === producto.imagen360 ? (
               <Product360View imageUrl={producto.imagen360} width={300} height={300} />
            ) : (
               <img src={imagenActiva} alt={producto.nombre} className="w-full h-full object-contain" />
            )}
          </div>
          <div className="flex gap-2 md:gap-3 overflow-x-auto w-full max-w-md pb-2">
            {producto.imagen360 && (
              <button onClick={() => setImagenActiva(producto.imagen360)} className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 border-2 rounded-lg overflow-hidden bg-white flex items-center justify-center text-xs font-bold ${imagenActiva === producto.imagen360 ? 'border-green-500' : 'border-transparent'}`}>360°</button>
            )}
            {producto.imagenPrincipal && (
              <button onClick={() => setImagenActiva(producto.imagenPrincipal)} className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 border-2 rounded-lg overflow-hidden ${imagenActiva === producto.imagenPrincipal ? 'border-green-500' : 'border-transparent'}`}>
                <img src={producto.imagenPrincipal} alt="principal" className="w-full h-full object-cover" />
              </button>
            )}
            {producto.galeriaImagenes?.map((img, idx) => (
              <button key={idx} onClick={() => setImagenActiva(img)} className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 border-2 rounded-lg overflow-hidden ${imagenActiva === img ? 'border-green-500' : 'border-transparent'}`}>
                <img src={img} alt={`galeria-${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <span className="text-xs font-bold text-green-600 tracking-wider uppercase mb-1">{producto.categoria}</span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-2 leading-tight">{producto.nombre}</h1>
          <p className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 md:mb-6">${Number(producto.precio).toLocaleString('es-AR')}</p>

          <div className="border-t border-b border-slate-100 py-4 md:py-6 mb-4 md:mb-6">
            <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6 leading-relaxed">{producto.descripcion || "Sin descripción."}</p>

            {producto.talles?.length > 0 && (
              <div className="mb-4 md:mb-6">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-sm font-bold text-slate-800">Seleccioná tu talle:</h3>
                  <span className="text-xs text-slate-500 font-medium">Stock total: {producto.stock} un.</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {producto.talles.map(t => (
                    <button key={t} onClick={() => setTalleSeleccionado(t)} className={`min-w-[3rem] py-2 px-3 md:px-4 rounded-lg border-2 font-bold text-sm transition-all ${talleSeleccionado === t ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={handleAgregar} disabled={producto.stock <= 0} className={`w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all flex items-center justify-center gap-2 ${producto.stock <= 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : feedback ? 'bg-green-500 text-white shadow-lg' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'}`}>
            {producto.stock <= 0 ? 'Sin stock' : feedback ? '¡Agregado al carrito!' : 'Agregar al carrito'}
          </button>

          <button onClick={() => navigate('/')} className="mt-3 text-center w-full text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2">
            Seguir mirando otras camisetas
          </button>
        </div>
      </div>
    </div>
  );
}