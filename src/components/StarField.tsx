import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const stars: Star[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 0.3 + 0.05,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const star of stars) {
        star.opacity += star.speed * 0.01 * (Math.random() > 0.5 ? 1 : -1);
        star.opacity = Math.max(0.05, Math.min(0.6, star.opacity));
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(185, 100%, 70%, ${star.opacity})`;
        ctx!.fill();
      }
      animationId = requestAnimationFrame(draw);
    }

    resize();
    initStars();
    draw();

    window.addEventListener("resize", () => {
      resize();
      initStars();
    });

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
    />
  );
}
