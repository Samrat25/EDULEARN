import React, { useEffect, useState } from 'react';

const HeroAnimatedBackground: React.FC = () => {
  const [stars, setStars] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars = [];
      const starCount = 50;
      
      for (let i = 0; i < starCount; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 3 + 2;
        const opacity = Math.random() * 0.5 + 0.2;
        
        newStars.push(
          <div 
            key={i}
            className="star"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              '--twinkle-delay': `${delay}s`,
              '--twinkle-duration': `${duration}s`,
              '--twinkle-opacity': opacity,
            } as React.CSSProperties}
          />
        );
      }
      
      setStars(newStars);
    };
    
    generateStars();
    
    // Regenerate stars on window resize
    const handleResize = () => {
      generateStars();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <>
      <div className="hero-backdrop" />
      <div className="hero-gradient" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />
      <div className="star-field">
        {stars}
      </div>
    </>
  );
};

export default HeroAnimatedBackground; 