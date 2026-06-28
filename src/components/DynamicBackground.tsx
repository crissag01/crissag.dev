import { useEffect, useRef } from 'react';
import './DynamicBackground.css';

export function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const particles: Particle[] = [];
    const particleCount = 30;
    const connectionDistance = 150;
    let lastFrameTime = 0;
    const targetFps = 30;
    const frameDuration = 1000 / targetFps;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 0.8,
      });
    }

    const animate = (currentTime: number) => {
      if (currentTime - lastFrameTime < frameDuration) {
        requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;

      ctx.fillStyle = 'rgba(5, 10, 20, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const connectionDistSq = connectionDistance * connectionDistance;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        // Draw particle with green color (no glow for performance)
        const pulse = Math.sin(time * 0.01 + i) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(34, 197, 94, ${0.6 * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw connections with green (optimized with squared distance)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < connectionDistSq) {
            const distance = Math.sqrt(distanceSq);
            const alpha = (1 - distance / connectionDistance) * 0.3;
            ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      time += 1;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="dynamic-background" />;
}
