import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Grupo Bitwars
 * Página: Register
 *
 * ⚠️ CORRECCIÓN APLICADA:
 * El destructuring original dejaba `confirmPassword` "sin usar", lo que genera
 * warning de ESLint. Ahora se hace una copia del form y se borra explícitamente
 * antes de enviar el payload al backend.
 */
const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán',
];

const FORM_INICIAL = {
  nombre: '',
  email: '',
  password: '',
  confirmPassword: '',
  telefono: '',
  dni: '',
  calle: '',
  numero: '',
  pisoDepto: '',
  localidad: '',
  provincia: '',
  codigoPostal: '',
};

export default function Register() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }
    if (!/^\d{7,8}$/.test(form.dni)) {
      return setError('El DNI debe tener 7 u 8 dígitos (sin puntos).');
    }
    if (!/^\d{4}$/.test(form.codigoPostal)) {
      return setError('El código postal debe tener 4 dígitos.');
    }
    if (!/^\d{6,15}$/.test(form.telefono.replace(/[\s-]/g, ''))) {
      return setError('El teléfono debe tener entre 6 y 15 dígitos.');
    }

    setCargando(true);

    // ⚠️ Copiamos y borramos `confirmPassword` explícitamente (evita warning ESLint)
    const payload = { ...form };
    delete payload.confirmPassword;

    const result = await register(payload);
    setCargando(false);

    if (result.success) navigate('/');
    else setError(result.error);
  };

  const inputCls =
    'border border-slate-300 p-3 rounded focus:outline-none focus:border-green-500 w-full';

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-1 text-slate-800">Crear cuenta</h2>
        <p className="text-center text-sm text-slate-500 mb-6">
          Completá todos tus datos para poder comprar
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <h3 className="font-semibold text-slate-700 border-b pb-1">Datos de acceso</h3>

          <input
            type="text" name="nombre" placeholder="Nombre y apellido"
            value={form.nombre} onChange={handleChange}
            required minLength={2} className={inputCls}
          />

          <input
            type="email" name="email" placeholder="Correo electrónico"
            value={form.email} onChange={handleChange}
            required className={inputCls}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} name="password"
              placeholder="Contraseña (mín. 6 caracteres)"
              value={form.password} onChange={handleChange}
              required minLength={6} className={`${inputCls} pr-12`}
            />
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Mostrar/ocultar contraseña"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <input
            type={showPassword ? 'text' : 'password'} name="confirmPassword"
            placeholder="Repetí la contraseña"
            value={form.confirmPassword} onChange={handleChange}
            required minLength={6} className={inputCls}
          />

          <h3 className="font-semibold text-slate-700 border-b pb-1 mt-2">Datos personales</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text" name="dni" placeholder="DNI (sin puntos)" maxLength={8}
              value={form.dni} onChange={handleChange}
              required pattern="\d{7,8}" className={inputCls}
            />
            <input
              type="tel" name="telefono" placeholder="Teléfono (ej. 2604123456)"
              value={form.telefono} onChange={handleChange}
              required pattern="[\d\s-]{6,15}" className={inputCls}
            />
          </div>

          <h3 className="font-semibold text-slate-700 border-b pb-1 mt-2">Domicilio de envío</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text" name="calle" placeholder="Calle"
              value={form.calle} onChange={handleChange}
              required className={`${inputCls} md:col-span-2`}
            />
            <input
              type="text" name="numero" placeholder="Número"
              value={form.numero} onChange={handleChange}
              required className={inputCls}
            />
          </div>

          <input
            type="text" name="pisoDepto"
            placeholder="Piso / Depto (poné S/N si no aplica)"
            value={form.pisoDepto} onChange={handleChange}
            required className={inputCls}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text" name="localidad" placeholder="Localidad"
              value={form.localidad} onChange={handleChange}
              required className={`${inputCls} md:col-span-2`}
            />
            <input
              type="text" name="codigoPostal" placeholder="Código Postal" maxLength={4}
              value={form.codigoPostal} onChange={handleChange}
              required pattern="\d{4}" className={inputCls}
            />
          </div>

          <select
            name="provincia" value={form.provincia} onChange={handleChange}
            required className={inputCls}
          >
            <option value="">— Seleccioná provincia —</option>
            {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <button
            type="submit" disabled={cargando}
            className={`text-white font-bold py-3 rounded transition mt-2 ${
              cargando ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}