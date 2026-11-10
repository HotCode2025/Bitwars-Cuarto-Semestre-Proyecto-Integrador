import { useEffect, useState } from 'react';

const TECNOLOGIAS = [
  { nombre: 'React', logo: '/logos/react.svg' },
  { nombre: 'Spring Boot', logo: '/logos/spring.svg' },
  { nombre: 'Neon Postgres', logo: '/logos/neon.svg' },
  { nombre: 'Mercado Pago', logo: '/logos/mercadopago.svg' },
  { nombre: 'Cloudinary', logo: '/logos/cloudinary.svg' },
  { nombre: 'ViteJs', logo: '/logos/vitejs.svg' },
  { nombre: 'Docker', logo: '/logos/docker.svg' },
  { nombre: 'Netlify', logo: '/logos/netlify.svg' },
  { nombre: 'UptimeRobot', logo: '/logos/uptimerobot.svg' },
  { nombre: 'Java', logo: '/logos/java.svg' },
  { nombre: 'PostgreSQL', logo: '/logos/postgresql.svg' },
];

const MENSAJES_CARGA = [
  "Inicializando sistemas de Bitwars...",
  "Cargando dependencias del núcleo...",
  "Estableciendo conexión segura y encriptada...",
  "Sincronizando pasarela de pagos y base de datos...",
  "Desplegando contenedores y módulos...",
  "Optimizando rendimiento en tiempo real...",
  "¡Todo listo, despegando!"
];

/**
 * Grupo Bitwars
 * Componente: SplashScreen
 *
 * ⚠️ CORRECCIONES APLICADAS:
 * 1) La prop `duration` AHORA se usa. Antes App.jsx la pasaba (12000) y el componente
 *    la ignoraba usando 15000 hardcodeado. Ahora todo el timing sale de `duration`.
 * 2) El intervalo entre mensajes se calcula en función de `duration` y la cantidad
 *    de mensajes, para que siempre se muestren todos aunque cambies el total.
 * 3) La animación de la barra de progreso usa inline style con `duration`, así
 *    ya no está hardcodeado en 15s en el bloque <style>.
 * 4) Se eliminó la mención a "audio" (el doc lo prometía pero el código nunca lo tuvo).
 */
export default function SplashScreen({ onFinish, duration = 12000 }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [mensajeIndex, setMensajeIndex] = useState(0);

  useEffect(() => {
    // ⚠️ Intervalo dinámico: se distribuye `duration` entre la cantidad de mensajes
    const intervaloMensaje = Math.max(500, Math.floor(duration / MENSAJES_CARGA.length));

    const intervalMsg = setInterval(() => {
      setMensajeIndex((prev) => (prev < MENSAJES_CARGA.length - 1 ? prev + 1 : prev));
    }, intervaloMensaje);

    // Fade-out 1s antes del fin
    const timerFade = setTimeout(() => setFadeOut(true), Math.max(0, duration - 1000));

    // Fin exacto en `duration`
    const timerEnd = setTimeout(() => onFinish?.(), duration);

    return () => {
      clearInterval(intervalMsg);
      clearTimeout(timerFade);
      clearTimeout(timerEnd);
    };
  }, [onFinish, duration]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 overflow-hidden transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(16,185,129,0.12)_0%,rgba(0,0,0,0)_100%)] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[750px] h-[750px] bg-emerald-500/10 rounded-full blur-[160px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[750px] h-[750px] bg-cyan-500/10 rounded-full blur-[160px] animate-pulse delay-1000"></div>

      <div className="relative z-10 flex flex-col items-center w-full px-6 max-w-3xl">
        <div className="h-12 flex items-center justify-center mb-6 px-6 py-2 rounded-xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent text-xs md:text-sm font-mono tracking-[0.25em] uppercase font-bold animate-pulse text-center">
            {"> "} {MENSAJES_CARGA[mensajeIndex]}
          </span>
        </div>

        <div className="relative w-[500px] h-[500px] md:w-[620px] md:h-[620px] flex items-center justify-center mb-8" style={{ perspective: '1400px' }}>
          <div className="absolute inset-2 border border-emerald-500/20 rounded-full animate-[spin_30s_linear_infinite]"></div>
          <div className="absolute inset-16 border border-dashed border-cyan-500/30 rounded-full animate-[spin_25s_linear_infinite_reverse]"></div>
          <div className="absolute inset-32 border border-emerald-400/30 rounded-full"></div>

          <div className="absolute z-20 w-44 h-44 md:w-56 md:h-56 bg-slate-900/95 rounded-3xl flex items-center justify-center shadow-[0_0_90px_rgba(16,185,129,0.45)] border border-emerald-400/50 backdrop-blur-2xl animate-[float_4s_ease-in-out_infinite]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/25 via-teal-500/10 to-transparent rounded-3xl"></div>
            <img
              src="/bitwars.png"
              alt="Bitwars Sports"
              className="w-34 h-34 md:w-44 md:h-44 object-contain p-2 drop-shadow-[0_0_30px_rgba(16,185,129,0.9)]"
            />
          </div>

          <div className="absolute inset-0 animate-[spin_32s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
            {TECNOLOGIAS.map((tech, index) => {
              const angle = (index * 360) / TECNOLOGIAS.length;
              const radius = 245;

              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 w-0 h-0"
                  style={{
                    transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
                  }}
                >
                  <div className="group relative -top-11 -left-11 w-22 h-22 md:w-26 md:h-26 bg-slate-900/95 rounded-2xl p-4 border border-emerald-500/40 shadow-[0_12px_35px_rgba(0,0,0,0.85)] flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-125 hover:border-cyan-400 animate-[glow-bitwars_6s_ease-in-out_infinite]">
                    <img
                      src={tech.logo}
                      alt={tech.nombre}
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] animate-[spin-reverse_32s_linear_infinite]"
                    />
                    <span className="absolute -bottom-9 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 text-cyan-300 text-xs font-mono px-3 py-1.5 rounded border border-cyan-500/50 whitespace-nowrap pointer-events-none shadow-2xl z-30">
                      {tech.nombre}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-md mt-1">
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-full h-3 overflow-hidden p-0.5 shadow-inner backdrop-blur-sm">
            {/* ⚠️ Animación de barra con `duration` dinámico (antes era 15s hardcoded) */}
            <div
              className="bg-gradient-to-r from-emerald-600 via-teal-400 to-cyan-400 h-full rounded-full shadow-[0_0_20px_rgba(16,185,129,0.9)]"
              style={{ animation: `loading ${duration}ms cubic-bezier(0.25,1,0.5,1) forwards` }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes loading {
          0% { width: 0%; }
          90% { width: 95%; }
          100% { width: 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow-bitwars {
          0%, 100% {
            border-color: rgba(16, 185, 129, 0.4);
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
          }
          33% {
            border-color: rgba(6, 182, 212, 0.6);
            box-shadow: 0 0 25px rgba(6, 182, 212, 0.4);
          }
          66% {
            border-color: rgba(59, 130, 246, 0.6);
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.4);
          }
        }
      `}</style>
    </div>
  );
}