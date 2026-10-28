import { useEffect, useLayoutEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';

interface ScratchCoverProps {
  /** Applica la dissolvenza quando la pellicola è stata svelata. */
  revealed: boolean;
  /** Chiamata una sola volta al raggiungimento della soglia. */
  onComplete: () => void;
  /** Primo tratto: utile per un tick audio leggero. */
  onFirstScratch?: () => void;
}

/** Percentuale di pellicola da rimuovere per svelare la pagina. */
const THRESHOLD = 0.45;
/** Diametro del pennello in pixel CSS. */
const BRUSH = 28;
/** Risoluzione del campionamento per misurare la superficie grattata. */
const SAMPLE = 64;

interface Point {
  x: number;
  y: number;
  scale: number;
}

/**
 * Pellicola da grattare a copertura totale della landing.
 * Disegna tutto in pixel del canvas (DPR incluso) e mappa i pointer con il
 * rapporto tra backing store e dimensione CSS: così i tratti restano corretti
 * anche se il canvas viene scalato dopo un resize.
 */
export function ScratchCover({ revealed, onComplete, onFirstScratch }: ScratchCoverProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const doneRef = useRef(false);
  const scratchedRef = useRef(false);
  const firstScratchRef = useRef(false);
  const activePointerRef = useRef<number | null>(null);
  const lastPointRef = useRef<Point | null>(null);

  const onCompleteRef = useRef(onComplete);
  const onFirstScratchRef = useRef(onFirstScratch);
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onFirstScratchRef.current = onFirstScratch;
  }, [onComplete, onFirstScratch]);

  useEffect(() => {
    if (revealed) doneRef.current = true;
  }, [revealed]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    let cancelled = false;
    let intervalId = 0;

    const paintFoil = () => {
      const { width: w, height: h } = canvas;
      const cssWidth = canvas.getBoundingClientRect().width || 390;
      const unit = Math.max(0.8, cssWidth / 390);

      const sky = ctx.createLinearGradient(0, 0, w * 0.35, h);
      sky.addColorStop(0, '#4fbdf0');
      sky.addColorStop(0.42, '#8fd8f8');
      sky.addColorStop(0.72, '#ffd0e3');
      sky.addColorStop(1, '#ffe9a8');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Nuvolette morbide per non lasciare la pellicola piatta.
      ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
      const clouds: Array<[number, number, number]> = [
        [0.15, 0.2, 0.55],
        [0.88, 0.34, 0.42],
        [0.22, 0.78, 0.5],
        [0.75, 0.9, 0.38],
      ];
      for (const [cx, cy, radius] of clouds) {
        ctx.beginPath();
        ctx.arc(w * cx, h * cy, w * radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Scintille decorative.
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.textAlign = 'center';
      const sparkles: Array<[number, number, number]> = [
        [0.18, 0.32, 22],
        [0.82, 0.2, 16],
        [0.28, 0.68, 14],
        [0.78, 0.62, 20],
        [0.62, 0.83, 12],
      ];
      for (const [sx, sy, size] of sparkles) {
        ctx.font = `700 ${size * unit}px 'Baloo 2', Nunito, sans-serif`;
        ctx.fillText('✦', w * sx, h * sy);
      }

      // Bordo tratteggiato: sembra un biglietto da grattare.
      const inset = 14 * unit;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
      ctx.lineWidth = 2 * unit;
      ctx.setLineDash([8 * unit, 8 * unit]);
      const radius = 22 * unit;
      ctx.beginPath();
      ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, radius);
      ctx.stroke();
      ctx.setLineDash([]);

      // Istruzione principale.
      ctx.save();
      ctx.shadowColor = 'rgba(168, 29, 76, 0.28)';
      ctx.shadowBlur = 18 * unit;
      ctx.shadowOffsetY = 3 * unit;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.font = `800 ${36 * unit}px 'Baloo 2', Nunito, sans-serif`;
      ctx.fillText('Gratta per scoprire', w / 2, h * 0.5);
      ctx.restore();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
      ctx.font = `800 ${13 * unit}px Nunito, sans-serif`;
      ctx.fillText('Passa il dito e svela la sorpresa ✨', w / 2, h * 0.5 + 34 * unit);
    };

    const resize = () => {
      if (scratchedRef.current) return; // non azzerare i tratti già fatti
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.max(1, Math.round(rect.width * dpr));
      const nextHeight = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width === nextWidth && canvas.height === nextHeight) return;
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      paintFoil();
    };

    resize();
    if (canvas.width === 1 && canvas.height === 1) {
      // Layout non ancora pronto (raro): riprova al frame successivo.
      window.requestAnimationFrame(resize);
    }

    // Il canvas può partire prima che Baloo 2 sia caricato: ridisegna il testo
    // una volta disponibile, ma solo se l'utente non ha ancora grattato.
    void document.fonts?.ready.then(() => {
      if (!cancelled && !scratchedRef.current) paintFoil();
    });

    // Campionamento: disegna il canvas in 64×64 e conta i pixel trasparenti.
    const sample = document.createElement('canvas');
    sample.width = SAMPLE;
    sample.height = SAMPLE;
    const sampleCtx = sample.getContext('2d', { willReadFrequently: true });

    const complete = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      window.clearInterval(intervalId);
      onCompleteRef.current();
    };

    const measure = () => {
      if (doneRef.current || !sampleCtx) return;
      sampleCtx.clearRect(0, 0, SAMPLE, SAMPLE);
      sampleCtx.drawImage(canvas, 0, 0, SAMPLE, SAMPLE);
      const { data } = sampleCtx.getImageData(0, 0, SAMPLE, SAMPLE);
      let erased = 0;
      for (let index = 3; index < data.length; index += 4) {
        if (data[index] < 40) erased += 1;
      }
      if (erased / (SAMPLE * SAMPLE) >= THRESHOLD) complete();
    };

    intervalId = window.setInterval(() => {
      if (scratchedRef.current) measure();
    }, 220);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      observer.disconnect();
      ctxRef.current = null;
    };
  }, []);

  const getPoint = (event: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, scale: 1 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(1, rect.width);
    const scaleY = canvas.height / Math.max(1, rect.height);
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
      scale: (scaleX + scaleY) / 2,
    };
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (doneRef.current) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (activePointerRef.current !== null) return;

    const ctx = ctxRef.current;
    if (!ctx) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    activePointerRef.current = event.pointerId;

    const point = getPoint(event);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(point.x, point.y, (BRUSH * point.scale) / 2, 0, Math.PI * 2);
    ctx.fill();
    lastPointRef.current = point;
    scratchedRef.current = true;

    if (!firstScratchRef.current) {
      firstScratchRef.current = true;
      onFirstScratchRef.current?.();
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (doneRef.current || activePointerRef.current !== event.pointerId) return;
    const ctx = ctxRef.current;
    const last = lastPointRef.current;
    if (!ctx || !last) return;

    event.preventDefault();
    const point = getPoint(event);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = BRUSH * point.scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    lastPointRef.current = point;
  };

  const endStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (activePointerRef.current !== event.pointerId) return;
    activePointerRef.current = null;
    lastPointRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onContextMenu = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
  };

  return (
    <canvas
      ref={canvasRef}
      className={`landing__scratch${revealed ? ' is-revealed' : ''}`}
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endStroke}
      onPointerCancel={endStroke}
      onLostPointerCapture={endStroke}
      onContextMenu={onContextMenu}
    />
  );
}
