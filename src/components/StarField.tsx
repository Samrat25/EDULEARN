import React, { useEffect, useRef, useState } from 'react';

interface StarFieldProps {
  starCount?: number;
  speed?: number;
  interactive?: boolean;
}

const StarField: React.FC<StarFieldProps> = ({
  starCount = 100,
  speed = 0.5,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
  }>>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  // Initialize stars
  useEffect(() => {
    const generateStars = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      setDimensions({
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
      });
      
      const stars = [];
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.offsetWidth;
        const y = Math.random() * canvas.offsetHeight;
        const size = Math.random() * 1.5 + 0.5;
        
        // Generate color in blue to purple range
        const hue = Math.floor(Math.random() * 60) + 220; // 220-280 is blue to purple
        const saturation = Math.floor(Math.random() * 50) + 50; // 50-100%
        const lightness = Math.floor(Math.random() * 30) + 70; // 70-100%
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        const starSpeed = Math.random() * speed + 0.1;
        
        stars.push({ x, y, size, color, speed: starSpeed });
      }
      
      starsRef.current = stars;
    };
    
    generateStars();
    
    const handleResize = () => {
      generateStars();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [starCount, speed]);
  
  // Handle mouse interaction
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [interactive]);
  
  // Animation logic
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      starsRef.current.forEach((star) => {
        ctx.beginPath();
        
        // If mouse is active, add a glow effect to nearby stars
        if (mouseRef.current.active) {
          const dx = star.x - mouseRef.current.x;
          const dy = star.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const intensity = 1 - distance / 150;
            
            // Add glow
            ctx.shadowBlur = star.size * 4 * intensity;
            ctx.shadowColor = star.color;
            
            // Make star bigger based on proximity
            const sizeFactor = 1 + intensity * 2;
            ctx.arc(star.x, star.y, star.size * sizeFactor, 0, Math.PI * 2);
            
            // Move stars slightly towards mouse
            star.x += dx * -0.01 * intensity;
            star.y += dy * -0.01 * intensity;
          } else {
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          }
        } else {
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        }
        
        ctx.fillStyle = star.color;
        ctx.fill();
        ctx.closePath();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Star twinkle animation
        star.size = Math.max(0.5, star.size + Math.sin(Date.now() * 0.001 * star.speed) * 0.1);
        
        // Move stars down slowly (parallax effect)
        star.y += star.speed * 0.2;
        
        // Reset stars that move off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
};

export default StarField; 