import React, { useEffect, useRef } from 'react';

interface AnimatedCircuitsProps {
  color?: string;
  density?: number;
  opacity?: number;
}

const AnimatedCircuits: React.FC<AnimatedCircuitsProps> = ({
  color = '#4169e1',
  density = 10,
  opacity = 0.15,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();
    const width = svgRect.width;
    const height = svgRect.height;
    
    // Calculate circuit points based on density
    const columns = Math.floor(width / (100 / density));
    const rows = Math.floor(height / (100 / density));
    
    // Grid spacing
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    
    // Store all created elements to manipulate later
    const paths: SVGPathElement[] = [];
    const circles: SVGCircleElement[] = [];
    
    // Generate initial grid points
    const gridPoints: { x: number; y: number }[][] = [];
    for (let i = 0; i <= columns; i++) {
      gridPoints[i] = [];
      for (let j = 0; j <= rows; j++) {
        // Add some randomness to grid
        const offsetX = Math.random() * (cellWidth * 0.3);
        const offsetY = Math.random() * (cellHeight * 0.3);
        gridPoints[i][j] = {
          x: i * cellWidth + offsetX,
          y: j * cellHeight + offsetY,
        };
      }
    }
    
    // Create connections between points
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        // Not all cells will have connections
        if (Math.random() > 0.7) continue;
        
        // Create a path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Randomly choose connection type: horizontal, vertical, or both
        const connectionType = Math.floor(Math.random() * 3);
        
        // Generate path data
        let d = `M ${gridPoints[i][j].x} ${gridPoints[i][j].y}`;
        
        if (connectionType === 0 || connectionType === 2) { // Horizontal
          d += ` L ${gridPoints[i + 1][j].x} ${gridPoints[i + 1][j].y}`;
        }
        
        if (connectionType === 1 || connectionType === 2) { // Vertical
          d += ` L ${gridPoints[i][j + 1].x} ${gridPoints[i][j + 1].y}`;
        }
        
        // Set path attributes
        path.setAttribute('d', d);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-opacity', (Math.random() * 0.5 + 0.3).toString());
        
        // Add some dashed lines
        if (Math.random() > 0.7) {
          path.setAttribute('stroke-dasharray', `${Math.random() * 5 + 2} ${Math.random() * 5 + 2}`);
        }
        
        // Animate the stroke-dashoffset for some paths
        if (Math.random() > 0.5) {
          const length = path.getTotalLength();
          path.setAttribute('stroke-dasharray', length.toString());
          path.setAttribute('stroke-dashoffset', length.toString());
          
          // Create animation
          const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
          animate.setAttribute('attributeName', 'stroke-dashoffset');
          animate.setAttribute('from', length.toString());
          animate.setAttribute('to', '0');
          animate.setAttribute('dur', (Math.random() * 4 + 3) + 's');
          animate.setAttribute('repeatCount', 'indefinite');
          path.appendChild(animate);
        }
        
        // Add path to SVG
        svg.appendChild(path);
        paths.push(path);
        
        // Add a node/circle at some intersections
        if (Math.random() > 0.7) {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', gridPoints[i][j].x.toString());
          circle.setAttribute('cy', gridPoints[i][j].y.toString());
          circle.setAttribute('r', (Math.random() * 2 + 1).toString());
          circle.setAttribute('fill', color);
          
          // Add pulse animation to some circles
          if (Math.random() > 0.5) {
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animate.setAttribute('attributeName', 'r');
            animate.setAttribute('values', `${Math.random() + 0.5};${Math.random() * 3 + 1.5};${Math.random() + 0.5}`);
            animate.setAttribute('dur', (Math.random() * 3 + 2) + 's');
            animate.setAttribute('repeatCount', 'indefinite');
            circle.appendChild(animate);
            
            const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animateOpacity.setAttribute('attributeName', 'opacity');
            animateOpacity.setAttribute('values', '0.3;0.8;0.3');
            animateOpacity.setAttribute('dur', (Math.random() * 3 + 2) + 's');
            animateOpacity.setAttribute('repeatCount', 'indefinite');
            circle.appendChild(animateOpacity);
          }
          
          svg.appendChild(circle);
          circles.push(circle);
        }
      }
    }
    
    // Cleanup
    return () => {
      paths.forEach(path => path.remove());
      circles.forEach(circle => circle.remove());
    };
  }, [color, density]);
  
  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    ></svg>
  );
};

export default AnimatedCircuits; 