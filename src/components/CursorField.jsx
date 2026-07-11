import { useEffect, useRef } from 'react';

/**
 * CursorField — Interactive 3D particle/constellation Canvas background
 * Zero-latency cursor tracking, parallax depth, Apple-style smooth aesthetic.
 */
function CursorField() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Particle config
    const PARTICLE_COUNT = Math.min(120, Math.floor((width * height) / 10000));
    const CONNECTION_DIST = 180;
    const CURSOR_RADIUS = 250;
    const CURSOR_FORCE = 0.08;

    // Apple-style subtle sci-fi palette (deep purples, soft cyans, clean whites)
    const COLORS = [
      'rgba(255, 255, 255, 0.8)', // bright star
      'rgba(147, 197, 253, 0.6)', // soft blue
      'rgba(196, 181, 253, 0.5)', // soft purple
      'rgba(255, 255, 255, 0.3)', // distant star
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        
        // 3D depth: z goes from 0.2 (far) to 1.5 (close)
        this.z = Math.random() * 1.3 + 0.2; 
        
        // Velocity scales with depth (closer moves faster)
        this.vx = (Math.random() - 0.5) * 0.8 * this.z;
        this.vy = (Math.random() - 0.5) * 0.8 * this.z;
        
        // Radius scales with depth
        this.radius = (Math.random() * 1.5 + 0.5) * this.z;
        
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.baseVx = this.vx;
        this.baseVy = this.vy;
      }

      update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Cursor interaction (closer particles react more)
        if (dist < CURSOR_RADIUS && dist > 0) {
          const force = (1 - dist / CURSOR_RADIUS) * CURSOR_FORCE * this.z;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }

        // Damping back to base velocity
        this.vx += (this.baseVx - this.vx) * 0.03;
        this.vy += (this.baseVy - this.vy) * 0.03;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Subtle glow for closer particles
        if (this.z > 0.8) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(
            this.x, this.y, 0, this.x, this.y, this.radius * 2.5
          );
          glow.addColorStop(0, this.color.replace(/[\d.]+\)$/g, '0.2)'));
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fill();
        }
      }
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          // Only connect particles that are somewhat close in depth
          if (Math.abs(p1.z - p2.z) > 0.5) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.15 * Math.min(p1.z, p2.z);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
            ctx.lineWidth = 0.5 * Math.min(p1.z, p2.z);
            ctx.stroke();
          }
        }
      }
    }

    function drawCursorGlow(mouseX, mouseY) {
      if (mouseX < 0 || mouseY < 0) return;
      
      const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 400);
      grad.addColorStop(0, 'rgba(124, 58, 237, 0.05)'); // subtle violet glow
      grad.addColorStop(0.4, 'rgba(56, 189, 248, 0.02)'); // subtle blue
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      
      // Draw a large rectangle covering the screen to apply the radial gradient
      ctx.fillRect(0, 0, width, height);
    }

    // Capture exact mouse state for zero latency
    let currentMouseX = -1000;
    let currentMouseY = -1000;

    function animate() {
      // Clear with a very slight fade for motion blur (Apple-style smoothness)
      ctx.fillStyle = 'rgba(10, 10, 20, 0.3)';
      ctx.fillRect(0, 0, width, height);
      
      // We also clear completely sometimes to prevent heavy smearing
      // ctx.clearRect(0, 0, width, height); 
      // Actually, standard clearRect is cleaner for sharp sci-fi:
      ctx.clearRect(0, 0, width, height);

      drawCursorGlow(currentMouseX, currentMouseY);
      drawConnections();
      
      particles.forEach((p) => {
        p.update(currentMouseX, currentMouseY);
        p.draw();
      });
      
      animFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    // Raw event listeners for zero latency
    function handleMouseMove(e) {
      currentMouseX = e.clientX;
      currentMouseY = e.clientY;
    }

    function handleMouseLeave() {
      currentMouseX = -1000;
      currentMouseY = -1000;
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function handleTouchMove(e) {
      if (e.touches.length > 0) {
        currentMouseX = e.touches[0].clientX;
        currentMouseY = e.touches[0].clientY;
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}

export default CursorField;
