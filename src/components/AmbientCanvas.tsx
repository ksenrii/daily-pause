import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const colors = [
  "rgba(53, 191, 171, 0.45)",
  "rgba(31, 201, 231, 0.36)",
  "rgba(255, 253, 247, 0.55)"
];

export default function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const maybeContext = canvas.getContext("2d");
    if (!maybeContext) {
      return undefined;
    }

    const element = canvas;
    const context = maybeContext;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      element.width = Math.floor(width * ratio);
      element.height = Math.floor(height * ratio);
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: 9 }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.18,
        radius: 90 + Math.random() * 130,
        color: colors[index % colors.length]
      }));
    }

    function draw() {
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -particle.radius) particle.x = width + particle.radius;
        if (particle.x > width + particle.radius) particle.x = -particle.radius;
        if (particle.y < -particle.radius) particle.y = height + particle.radius;
        if (particle.y > height + particle.radius) particle.y = -particle.radius;

        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-80 blur-3xl">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
