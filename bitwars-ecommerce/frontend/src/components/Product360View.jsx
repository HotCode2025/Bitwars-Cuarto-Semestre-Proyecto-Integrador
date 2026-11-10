import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Grupo Bitwars
 * Componente: Product360View
 *
 * ⚠️ CORRECCIÓN APLICADA:
 * Se agregó un useEffect de cleanup que remueve los listeners de window
 * si el componente se desmonta mientras el usuario está arrastrando.
 * Antes, al navegar a otra página durante un drag, los listeners quedaban
 * colgados en window (leak).
 *
 * El resto de la lógica (Lerp, inercia, autoplay, render por canvas) se mantiene igual.
 */
export default function Product360View({
  imageUrl,
  width = 400,
  height = 400,
  autoPlay = true,
  autoPlaySpeed = 100,
  sensitivity = 7
}) {
  const [frame, setFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const dragStartX = useRef(0);
  const frameOnDragStart = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const animFrameId = useRef(null);
  const autoPlayTimer = useRef(null);

  const targetFrame = useRef(0);
  const currentFrameFloat = useRef(0);

  const cols = 6;
  const rows = 6;
  const totalFrames = 36;

  const bgUrl = imageUrl?.startsWith('http') ? imageUrl : (imageUrl ? `/${imageUrl}` : '');

  useEffect(() => {
    if (!bgUrl) return;
    setIsLoaded(false);
    const img = new Image();
    img.src = bgUrl;
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
    };
  }, [bgUrl]);

  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    const ctx = canvas.getContext('2d');

    const img = imageRef.current;
    const frameWidth = img.width / cols;
    const frameHeight = img.height / rows;

    const colIndex = frameIndex % cols;
    const rowIndex = Math.floor(frameIndex / cols);

    const sourceX = colIndex * frameWidth;
    const sourceY = rowIndex * frameHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      sourceX, sourceY, frameWidth, frameHeight,
      0, 0, canvas.width, canvas.height
    );
  }, [cols, rows]);

  const stopAnimation = useCallback(() => {
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
  }, []);

  useEffect(() => {
    return () => stopAnimation();
  }, [stopAnimation]);

  const startAutoPlay = useCallback(() => {
    if (!autoPlay || isDragging) return;
    stopAnimation();
    autoPlayTimer.current = setInterval(() => {
      targetFrame.current = (targetFrame.current + 1) % totalFrames;
    }, autoPlaySpeed);
  }, [autoPlay, autoPlaySpeed, isDragging, stopAnimation, totalFrames]);

  useEffect(() => {
    let loopId;
    const smoothLoop = () => {
      let diff = targetFrame.current - currentFrameFloat.current;

      if (diff > totalFrames / 2) diff -= totalFrames;
      if (diff < -totalFrames / 2) diff += totalFrames;

      const step = diff * 0.25;
      currentFrameFloat.current = (currentFrameFloat.current + step + totalFrames) % totalFrames;

      const rounded = Math.round(currentFrameFloat.current) % totalFrames;
      const activeFrame = rounded < 0 ? rounded + totalFrames : rounded;

      setFrame(activeFrame);
      drawFrame(activeFrame);

      loopId = requestAnimationFrame(smoothLoop);
    };

    loopId = requestAnimationFrame(smoothLoop);
    return () => cancelAnimationFrame(loopId);
  }, [totalFrames, drawFrame]);

  useEffect(() => {
    if (isLoaded && !isDragging && Math.abs(velocity.current) < 0.05) {
      startAutoPlay();
    }
    return () => stopAnimation();
  }, [isLoaded, isDragging, startAutoPlay, stopAnimation]);

  // ⚠️ CORRECCIÓN: cleanup de listeners si el componente se desmonta durante un drag
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyInertia = useCallback(() => {
    if (Math.abs(velocity.current) < 0.02) {
      velocity.current = 0;
      startAutoPlay();
      return;
    }

    targetFrame.current = (targetFrame.current - velocity.current + totalFrames) % totalFrames;
    velocity.current *= 0.92;
    animFrameId.current = requestAnimationFrame(applyInertia);
  }, [startAutoPlay, totalFrames]);

  const handlePointerDown = (e) => {
    if (!isLoaded) return;
    e.preventDefault();
    stopAnimation();
    setShowHint(false);

    setIsDragging(true);
    dragStartX.current = e.clientX;
    frameOnDragStart.current = targetFrame.current;
    lastX.current = e.clientX;
    lastTime.current = performance.now();
    velocity.current = 0;

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    const now = performance.now();
    const timeDelta = now - lastTime.current;
    const deltaX = e.clientX - dragStartX.current;

    const frameOffset = deltaX / sensitivity;
    targetFrame.current = (frameOnDragStart.current - frameOffset + totalFrames * 100) % totalFrames;

    if (timeDelta > 0) {
      const currentDeltaX = e.clientX - lastX.current;
      velocity.current = (currentDeltaX / timeDelta) * 3.5;
    }

    lastX.current = e.clientX;
    lastTime.current = now;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);

    if (Math.abs(velocity.current) > 0.08) {
      animFrameId.current = requestAnimationFrame(applyInertia);
    } else {
      startAutoPlay();
    }
  };

  const currentAngle = Math.round((frame / totalFrames) * 360);

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Vista 360 grados en Canvas de camiseta"
      onPointerDown={handlePointerDown}
      className="relative select-none overflow-hidden flex items-center justify-center bg-slate-900/50 rounded-2xl shadow-2xl border border-emerald-500/20 outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-grab active:cursor-grabbing group transition-all backdrop-blur-md"
      style={{ width, height, touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`w-full h-full ${isLoaded ? 'block' : 'hidden'}`}
      />

      {!isLoaded && (
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <svg className="animate-spin h-7 w-7 text-emerald-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs font-mono tracking-wider text-emerald-400/80">Cargando Canvas 360°...</span>
        </div>
      )}

      {isLoaded && showHint && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none animate-bounce">
          <div className="bg-slate-900/90 backdrop-blur-md text-emerald-300 font-mono text-[11px] px-3.5 py-1.5 rounded-full border border-emerald-500/40 shadow-xl flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Arrastra para girar 360°
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      )}

      {isLoaded && (
        <div className={`absolute top-4 right-4 pointer-events-none bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 transition-opacity duration-300 ${isDragging ? 'opacity-30' : 'opacity-90'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          360° Canvas ({currentAngle}°)
        </div>
      )}
    </div>
  );
}