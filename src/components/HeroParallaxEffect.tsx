import { useEffect, useRef } from 'react';

interface HeroParallaxEffectProps {
  speed?: number;
}

const HeroParallaxEffect = ({ speed = 0.05 }: HeroParallaxEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbs = Array.from({ length: 15 }).map(() => ({
    size: Math.random() * 200 + 50, // Size between 50-250px
    positionX: Math.random() * 100, // Percent position X
    positionY: Math.random() * 100, // Percent position Y
    blur: Math.random() * 10 + 5,   // Blur between 5-15px
    opacity: Math.random() * 0.3 + 0.1, // Opacity between 0.1-0.4
    hue: Math.floor(Math.random() * 60) + 230, // Blues to purples (230-290)
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const { clientX, clientY } = e;
      const rect = container.getBoundingClientRect();
      
      // Calculate mouse position relative to the container
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      
      // Calculate movement direction (-1 to 1 range)
      const moveX = (x - 0.5) * 2;
      const moveY = (y - 0.5) * 2;
      
      // Apply parallax effect to each orb
      const orbs = container.querySelectorAll('.parallax-orb');
      orbs.forEach((orb, index) => {
        const depthFactor = 0.5 + (index / orbs.length) * 0.5; // Depth factor varies from 0.5 to 1
        const translateX = moveX * speed * 100 * depthFactor;
        const translateY = moveY * speed * 100 * depthFactor;
        
        (orb as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [speed]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden z-0 pointer-events-none"
      aria-hidden="true"
    >
      {orbs.map((orb, index) => (
        <div
          key={index}
          className="parallax-orb absolute rounded-full animate-orb-float"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: `${orb.positionX}%`,
            top: `${orb.positionY}%`,
            backgroundColor: `hsla(${orb.hue}, 70%, 60%, ${orb.opacity})`,
            filter: `blur(${orb.blur}px)`,
            transform: 'translate(0, 0)',
            transition: 'transform 0.2s ease-out',
            animationDelay: `${index * 0.2}s`,
            animationDuration: `${5 + index % 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default HeroParallaxEffect; 