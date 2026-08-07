import React, { useEffect, useRef } from 'react';

export const StarfieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Create stars
    const starCount = Math.min(Math.floor((width * height) / 4500), 180);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * width,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.3 ? '#F59E0B' : (Math.random() > 0.5 ? '#E0E7FF' : '#93C5FD'),
    }));

    // Floating particles (golden dust)
    const particleCount = 40;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Deep dark background gradient
      const bgGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height)
      );
      bgGradient.addColorStop(0, '#0a0d18');
      bgGradient.addColorStop(0.6, '#06080e');
      bgGradient.addColorStop(1, '#020306');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle parallax shift based on mouse position
      const parallaxX = (mouseX - width / 2) * 0.02;
      const parallaxY = (mouseY - height / 2) * 0.02;

      // Render stars
      stars.forEach((star) => {
        star.alpha = star.baseAlpha + Math.sin(time * 2 + star.x) * 0.25;
        const currentAlpha = Math.max(0.1, Math.min(1, star.alpha));

        const drawX = star.x + parallaxX * (star.radius / 2);
        const drawY = star.y + parallaxY * (star.radius / 2);

        ctx.save();
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = star.radius > 1.2 ? 8 : 2;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.restore();
      });

      // Render golden floating dust
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.y) * 0.2;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#F59E0B';
        ctx.globalAlpha = p.alpha * 0.7;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
