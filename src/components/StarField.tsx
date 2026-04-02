import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  drift: number;
  angle: number;
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
      for (let i = 0; i < 180; i++) {
        stars.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          radius: Math.random() * 1.8 + 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 0.4 + 0.05,
          drift: Math.random() * 0.3 + 0.05,
          angle: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const star of stars) {
        // Twinkle
        star.opacity += star.speed * 0.015 * (Math.random() > 0.5 ? 1 : -1);
        star.opacity = Math.max(0.03, Math.min(0.65, star.opacity));

        // Slow drift movement
        star.angle += 0.002;
        star.x += Math.cos(star.angle) * star.drift * 0.3;
        star.y += Math.sin(star.angle) * star.drift * 0.2 - 0.05;

        // Wrap around
        if (star.x < 0) star.x = canvas!.width;
        if (star.x > canvas!.width) star.x = 0;
        if (star.y < 0) star.y = canvas!.height;
        if (star.y > canvas!.height) star.y = 0;

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

    const onResize = () => { resize(); initStars(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
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
