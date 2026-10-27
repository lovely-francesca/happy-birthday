import { useEffect, useRef } from 'react';

const COLORS = ['#ffd166', '#ff4f8b', '#5fc8f6', '#a06cf0', '#ff9600', '#ff7ba5', '#ffffff', '#ffc93c'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Fuochi d'artificio su canvas: razzi che partono dal basso ed esplodono in particelle.
 * Si fermano da soli dopo il finale; nessuna dipendenza esterna.
 */
export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();
    let elapsed = 0;
    let nextLaunch = 220;

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const explode = (x: number, y: number) => {
      const primary = pick(COLORS);
      const secondary = pick(COLORS);
      const count = 52 + Math.floor(Math.random() * 28);

      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + Math.random() * 0.14;
        const speed = 1.2 + Math.random() * 4.4;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 68 + Math.random() * 52,
          maxLife: 120,
          color: Math.random() < 0.24 ? secondary : primary,
          size: 1.2 + Math.random() * 2.2,
        });
      }

      if (particles.length > 900) particles.splice(0, particles.length - 900);
    };

    const launch = () => {
      rockets.push({
        x: width * (0.16 + Math.random() * 0.68),
        y: height + 8,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(7.5 + Math.random() * 3.5),
        targetY: height * (0.12 + Math.random() * 0.38),
        color: pick(COLORS),
      });
    };

    const tick = (now: number) => {
      const delta = Math.min(now - last, 50);
      const step = delta / 16.6667;
      last = now;
      elapsed += delta;

      if (elapsed > nextLaunch && elapsed < 16000) {
        launch();
        nextLaunch = elapsed + 700 + Math.random() * 900;
      }

      for (let index = rockets.length - 1; index >= 0; index -= 1) {
        const rocket = rockets[index];
        rocket.vy += 0.055 * step;
        rocket.x += rocket.vx * step;
        rocket.y += rocket.vy * step;

        if (rocket.y <= rocket.targetY || rocket.vy >= 0) {
          explode(rocket.x, rocket.y);
          rockets.splice(index, 1);
        }
      }

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.vx *= Math.pow(0.985, step);
        particle.vy = particle.vy * Math.pow(0.985, step) + 0.035 * step;
        particle.x += particle.vx * step;
        particle.y += particle.vy * step;
        particle.life -= step;

        if (particle.life <= 0) particles.splice(index, 1);
      }

      // Le scie si dissolvono gradualmente senza coprire lo sfondo.
      context.globalCompositeOperation = 'destination-out';
      context.fillStyle = 'rgba(0, 0, 0, 0.16)';
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      for (const rocket of rockets) {
        context.globalAlpha = 0.95;
        context.fillStyle = rocket.color;
        context.beginPath();
        context.arc(rocket.x, rocket.y, 2.4, 0, Math.PI * 2);
        context.fill();

        context.globalAlpha = 0.25;
        context.beginPath();
        context.arc(rocket.x, rocket.y + 7, 1.6, 0, Math.PI * 2);
        context.fill();
      }

      for (const particle of particles) {
        const alpha = Math.max(0, Math.min(1, particle.life / 42));
        context.globalAlpha = alpha;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';

      if (elapsed < 20000 || particles.length > 0 || rockets.length > 0) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="fireworks" aria-hidden="true" />;
}
