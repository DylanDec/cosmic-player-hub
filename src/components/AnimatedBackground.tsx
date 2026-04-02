import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  drift: number;
  angle: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const stars: Star[] = [];

    // Slow-moving nebula blobs
    const nebulae = Array.from({ length: 4 }, () => ({
      xFrac: 0.1 + Math.random() * 0.8,
      yFrac: 0.1 + Math.random() * 0.8,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.06,
      radiusFrac: (300 + Math.random() * 200) / 1920,
      hue: Math.random() > 0.5 ? 185 : 320,
      alpha: 0.04 + Math.random() * 0.04,
    }));

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < 160; i++) {
        stars.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          radius: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.4 + 0.05,
          speed: Math.random() * 0.4 + 0.05,
          drift: Math.random() * 0.25 + 0.03,
          angle: Math.random() * Math.PI * 2,
        });
      }
    }

    let time = 0;

    function draw() {
      const cw = canvas!.width;
      const ch = canvas!.height;

      // Dark background
      ctx!.fillStyle = '#070a14';
      ctx!.fillRect(0, 0, cw, ch);

      // Moving nebula glows
      for (const n of nebulae) {
        const nx = n.xFrac * cw;
        const ny = n.yFrac * ch;
        const nr = n.radiusFrac * cw;
        n.xFrac += n.vx / cw;
        n.yFrac += n.vy / ch;
        if (n.xFrac < 0.05 || n.xFrac > 0.95) n.vx *= -1;
        if (n.yFrac < 0.05 || n.yFrac > 0.95) n.vy *= -1;

        const grad = ctx!.createRadialGradient(nx, ny, 0, nx, ny, nr);
        grad.addColorStop(0, `hsla(${n.hue}, 80%, 50%, ${n.alpha})`);
        grad.addColorStop(1, 'transparent');
        ctx!.fillStyle = grad;
        ctx!.fillRect(nx - nr, ny - nr, nr * 2, nr * 2);
      }

      // Stars with drift + twinkle
      for (const star of stars) {
        star.opacity += star.speed * 0.012 * (Math.random() > 0.5 ? 1 : -1);
        star.opacity = Math.max(0.03, Math.min(0.55, star.opacity));
        star.angle += 0.002;
        star.x += Math.cos(star.angle) * star.drift * 0.3;
        star.y += Math.sin(star.angle) * star.drift * 0.2 - 0.03;

        if (star.x < 0) star.x = cw;
        if (star.x > cw) star.x = 0;
        if (star.y < 0) star.y = ch;
        if (star.y > ch) star.y = 0;

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(185, 80%, 70%, ${star.opacity})`;
        ctx!.fill();
      }

      time += 0.016;
      animId = requestAnimationFrame(draw);
    }

    resize();
    initStars();
    draw();

    const onResize = () => { resize(); initStars(); };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
    />
  );
}
