import { useState } from 'react';
import { api } from '../services/api';
import { useProductos } from '../context/ProductosContext';

const FORM_INICIAL = { nombre: '', descripcion: '', precio: '', stock: '', categoria: 'Camisetas', dimensiones: '', imagenPrincipal: '', imagen360: '', talles: [], galeriaImagenes: [] };

export default function Admin() {
  const { productos, addLocal, updateLocal, removeLocal } = useProductos();
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [preview360, setPreview360] = useState(null);
  const [nuevoTalle, setNuevoTalle] = useState('');
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const categoriasExistentes = [...new Set(['Camisetas', 'Retro', 'Entrenamiento', 'Arqueros', 'Shorts', ...productos.map(p => p.categoria)])];
  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const subirACloudinary = async (file) => {
    if (file.size > 10 * 1024 * 1024) throw new Error("La imagen supera los 10MB");
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data.url;
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0]; if (!file) return;
    setSubiendoImagen(true);
    try {
      const url = await subirACloudinary(file);
      if (type === 'principal') { setForm(prev => ({ ...prev, imagenPrincipal: url })); setPreviewImg(url); }
      else { setForm(prev => ({ ...prev, imagen360: url })); setPreview360(url); }
    } catch (error) { alert(error.message); } finally { setSubiendoImagen(false); }
  };

  const handleGaleriaChange = async (e) => {
    const files = Array.from(e.target.files); if (files.length === 0) return;
    setSubiendoImagen(true);
    try {
      const urls = await Promise.all(files.map(f => subirACloudinary(f)));
      setForm(prev => ({ ...prev, galeriaImagenes: [...prev.galeriaImagenes, ...urls] }));
    } catch (error) { alert(error.message); } finally { setSubiendoImagen(false); e.target.value = null; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setEnviando(true); setMensaje(null);
    const payload = { ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock, 10) };
    try {
      if (editandoId) {
        const { data } = await api.put(`/productos/${editandoId}`, payload);
        updateLocal(data); setMensaje({ tipo: 'ok', texto: 'Producto actualizado' });
      } else {
        const { data } = await api.post('/productos', payload);
        addLocal(data); setMensaje({ tipo: 'ok', texto: 'Producto creado' });
      }
      limpiarFormulario();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.error || 'Error al guardar' });
    } finally { setEnviando(false); }
  };

  const handleConfirmarEliminar = async () => {
    if (!productoAEliminar) return;
    setEliminando(true);
    try {
      await api.delete(`/productos/${productoAEliminar.id}`);
      removeLocal(productoAEliminar.id); setMensaje({ tipo: 'ok', texto: 'Eliminado' });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.error || 'Error al eliminar' });
    } finally { setEliminando(false); setProductoAEliminar(null); }
  };

  const limpiarFormulario = () => { setForm(FORM_INICIAL); setPreviewImg(null); setPreview360(null); setEditandoId(null); setNuevoTalle(''); };
  const handleEditar = (p) => { setForm({ ...p, precio: String(p.precio), stock: String(p.stock), talles: p.talles || [], galeriaImagenes: p.galeriaImagenes || [] }); setEditandoId(p.id); setPreviewImg(p.imagenPrincipal); setPreview360(p.imagen360); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const inputCls = "border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:border-green-500 w-full text-sm";

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 relative">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 border-b pb-4">Panel de Admin</h1>

      {mensaje && <div className={`mb-6 px-4 py-3 rounded-lg border font-semibold ${mensaje.tipo === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{mensaje.texto}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 mb-12">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">1. Info Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className={`${inputCls} md:col-span-2`} placeholder="Nombre del producto" />
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="2" className={`${inputCls} md:col-span-2`} placeholder="Descripción"></textarea>
            <input type="number" name="precio" value={form.precio} onChange={handleChange} required className={inputCls} placeholder="Precio" />
            <input type="number" name="stock" value={form.stock} onChange={handleChange} required className={inputCls} placeholder="Stock" />
            <input type="text" name="categoria" list="cats" value={form.categoria} onChange={handleChange} required className={inputCls} placeholder="Categoría" />
            <datalist id="cats">{categoriasExistentes.map(c => <option key={c} value={c} />)}</datalist>
            <input type="text" name="dimensiones" value={form.dimensiones} onChange={handleChange} className={inputCls} placeholder="Dimensiones (opcional)" />
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">2. Talles</h2>
          <div className="flex gap-2 mb-4 max-w-sm">
            <input type="text" value={nuevoTalle} onChange={(e) => setNuevoTalle(e.target.value)} placeholder="Ej: S, M, L" className={inputCls} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), nuevoTalle && !form.talles.includes(nuevoTalle.toUpperCase()) && (setForm(prev => ({ ...prev, talles: [...prev.talles, nuevoTalle.toUpperCase()] })), setNuevoTalle('')))} />
            <button type="button" onClick={() => nuevoTalle && !form.talles.includes(nuevoTalle.toUpperCase()) && (setForm(prev => ({ ...prev, talles: [...prev.talles, nuevoTalle.toUpperCase()] })), setNuevoTalle(''))} className="bg-slate-800 text-white px-5 rounded-lg font-bold">+</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.talles.map(t => <span key={t} className="bg-slate-100 border px-3 py-1 rounded text-sm font-bold">{t} <button type="button" onClick={() => setForm(prev => ({ ...prev, talles: prev.talles.filter(x => x !== t) }))} className="text-red-500 ml-1">✕</button></span>)}
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">3. Imágenes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-dashed p-4 rounded-xl flex flex-col items-center relative min-h-[140px] bg-slate-50">
              {previewImg ? <img src={previewImg} className="h-24 object-contain" /> : <span className="text-xs text-slate-400">Imagen Principal</span>}
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'principal')} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="border-2 border-dashed p-4 rounded-xl flex flex-col items-center relative min-h-[140px] bg-slate-50">
              {preview360 ? <img src={preview360} className="h-24 object-contain" /> : <span className="text-xs text-slate-400">Imagen 360 (6x6)</span>}
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, '360')} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="border-2 border-dashed p-4 rounded-xl flex flex-col items-center relative min-h-[140px] bg-slate-50">
              <span className="text-xs text-slate-400">Galería Extra (Múltiple)</span>
              <input type="file" accept="image/*" multiple onChange={handleGaleriaChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {form.galeriaImagenes.map((url, idx) => <img key={idx} src={url} className="w-16 h-16 object-cover rounded border" />)}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {editandoId && <button type="button" onClick={limpiarFormulario} className="px-4 py-2 border rounded-lg">Cancelar</button>}
          <button type="submit" disabled={enviando} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg">{enviando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Guardar'}</button>
        </div>
      </form>

      {/* TABLA RESPONSIVE CON SCROLL HORIZONTAL */}
      <h2 className="text-xl md:text-2xl font-bold mb-4">Catálogo ({productos.length})</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 md:p-4 text-sm font-semibold">Imagen</th>
              <th className="p-3 md:p-4 text-sm font-semibold">Producto</th>
              <th className="p-3 md:p-4 text-sm font-semibold">Precio</th>
              <th className="p-3 md:p-4 text-sm font-semibold">Stock / Talles</th>
              <th className="p-3 md:p-4 text-sm font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productos.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-3 md:p-4">{p.imagenPrincipal ? <img src={p.imagenPrincipal} className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400">N/A</div>}</td>
                <td className="p-3 md:p-4"><p className="font-bold text-sm md:text-base">{p.nombre}</p><span className="text-[10px] text-green-600 font-bold uppercase">{p.categoria}</span></td>
                <td className="p-3 md:p-4 font-semibold text-sm">${Number(p.precio).toLocaleString('es-AR')}</td>
                <td className="p-3 md:p-4"><p className="text-sm font-semibold">Stock: {p.stock}</p><p className="text-xs text-slate-400">{p.talles?.join(' · ')}</p></td>
                <td className="p-3 md:p-4 text-right whitespace-nowrap">
                  <button onClick={() => handleEditar(p)} className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs md:text-sm font-semibold mr-2">Editar</button>
                  <button onClick={() => setProductoAEliminar(p)} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs md:text-sm font-semibold">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL ELIMINAR */}
      {productoAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2">¿Eliminar "{productoAEliminar.nombre}"?</h2>
            <p className="text-sm text-slate-500 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex flex-col gap-2">
              <button onClick={handleConfirmarEliminar} disabled={eliminando} className="bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700">{eliminando ? 'Eliminando...' : 'Sí, eliminar'}</button>
              <button onClick={() => setProductoAEliminar(null)} className="bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-lg">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}