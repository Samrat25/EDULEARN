import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';

// Helper to detect low-performance devices
const usePerformanceMode = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  useEffect(() => {
    // Check for low performance indicators
    const checkPerformance = () => {
      // Mobile devices are likely to be lower performance
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Detect lower-end devices by checking available memory (if supported)
      const hasLimitedMemory = 'deviceMemory' in navigator && 
        // @ts-ignore - deviceMemory is not in the standard navigator type
        (navigator.deviceMemory as number) < 4;
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      setIsLowPerformance(isMobile || hasLimitedMemory || prefersReducedMotion);
    };
    
    checkPerformance();
    
    // Also check on resize as user might rotate device
    window.addEventListener('resize', checkPerformance);
    return () => window.removeEventListener('resize', checkPerformance);
  }, []);
  
  return isLowPerformance;
};

// Optimized Floating particles component with reduced count
const Particles = ({ count = 50, color = '#4169e1' }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);
  
  // Create particle positions and scales with useMemo to optimize performance
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );
      const scale = Math.random() * 0.3 + 0.1;
      const speed = Math.random() * 0.01 + 0.002;
      const rotationSpeed = Math.random() * 0.01;
      const baseOffset = Math.random() * Math.PI * 2;
      
      temp.push({ position, scale, speed, rotationSpeed, baseOffset });
    }
    return temp;
  }, [count]);
  
  // Set up instanced mesh once
  useEffect(() => {
    if (!mesh.current) return;
    
    const dummy = new THREE.Object3D();
    
    // Initialize instanced mesh with particle data
    particles.forEach((particle, i) => {
      dummy.position.copy(particle.position);
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [particles]);
  
  // Animate particles
  useFrame((state) => {
    if (!mesh.current) return;
    
    const dummy = new THREE.Object3D();
    const time = state.clock.getElapsedTime();
    
    // Move lights in a circular pattern
    if (light.current) {
      light.current.position.x = Math.sin(time * 0.3) * 5;
      light.current.position.z = Math.cos(time * 0.3) * 5;
      light.current.intensity = 2 + Math.sin(time) * 0.5;
    }
    
    // Update each particle position and rotation
    particles.forEach((particle, i) => {
      // Calculate new position with sine/cosine waves for floating effect
      const position = particle.position.clone();
      position.y += Math.sin(time * particle.speed * 3 + particle.baseOffset) * 0.03;
      position.x += Math.cos(time * particle.speed * 2 + particle.baseOffset) * 0.03;
      position.z += Math.sin(time * particle.speed + particle.baseOffset) * 0.03;
      
      // Apply transformation
      dummy.position.copy(position);
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.rotation.set(
        time * particle.rotationSpeed,
        time * particle.rotationSpeed * 0.8,
        time * particle.rotationSpeed * 0.5
      );
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
    
    // Rotate the entire particle system slowly
    mesh.current.rotation.y = time * 0.05;
  });
  
  return (
    <group>
      <pointLight ref={light} distance={15} intensity={2} color={color} />
      <pointLight position={[-5, 3, 0]} distance={10} intensity={1} color="#00bcd4" />
      
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.8} 
          transparent 
          opacity={0.7} 
          emissive={color}
          emissiveIntensity={0.2}
        />
      </instancedMesh>
    </group>
  );
};

// Floating educational icons - reduced count
const FloatingIcons = () => {
  const group = useRef<THREE.Group>(null);
  
  // Create icons with positions - reduced to 3 for better performance
  const icons = useMemo(() => {
    return [
      { position: [2, 1, -2], rotation: [0, 0, 0], scale: 0.8, shape: 'cube' },
      { position: [-2, -1, -1], rotation: [0, 0, 0], scale: 0.6, shape: 'sphere' },
      { position: [3, -2, -3], rotation: [0, 0, 0], scale: 0.9, shape: 'torus' },
    ];
  }, []);
  
  // Animate icons
  useFrame((state) => {
    if (!group.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Rotate the entire group
    group.current.rotation.y = time * 0.1;
    
    // Animate each child
    group.current.children.forEach((child, i) => {
      child.position.y += Math.sin(time * 0.5 + i) * 0.01;
      child.rotation.x += 0.01;
      child.rotation.y += 0.01;
    });
  });
  
  return (
    <group ref={group}>
      {icons.map((icon, i) => {
        // Memoize the geometry
        const geometry = useMemo(() => {
          if (icon.shape === 'cube') return <boxGeometry args={[1, 1, 1]} />;
          if (icon.shape === 'sphere') return <sphereGeometry args={[0.5, 16, 16]} />;
          if (icon.shape === 'torus') return <torusGeometry args={[0.3, 0.2, 16, 32]} />;
          if (icon.shape === 'tetrahedron') return <tetrahedronGeometry args={[0.5, 0]} />;
          return null;
        }, [icon.shape]);
        
        return (
          <mesh key={i} position={icon.position} scale={icon.scale}>
            {geometry}
            <meshStandardMaterial 
              color="#8b5cf6" 
              metalness={0.5} 
              roughness={0.2} 
              transparent 
              opacity={0.8}
              emissive="#8b5cf6"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Starfield effect with reduced count
const Starfield = ({ count = 100 }) => {
  const mesh = useRef<THREE.Points>(null);
  
  // Create stars positions
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 25;
      positions[i3 + 1] = (Math.random() - 0.5) * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 25;
    }
    
    return positions;
  }, [count]);
  
  // Create star sizes
  const sizes = useMemo(() => {
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    
    return sizes;
  }, [count]);
  
  // Animate stars
  useFrame((state) => {
    if (!mesh.current) return;
    
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.05;
    mesh.current.rotation.x = time * 0.025;
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          array={positions} 
          count={count} 
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        sizeAttenuation={true}
        color="#ffffff" 
        transparent 
        opacity={0.8}
      />
    </points>
  );
};

// Main component with optimal 3D settings
const HeroBackground = () => {
  // Create a state for the canvas to handle SSR
  const [mounted, setMounted] = useState(false);
  const isLowPerformance = usePerformanceMode();
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  // For low performance devices, show a simplified version
  if (isLowPerformance) {
    return (
      <div className="absolute inset-0 z-0 opacity-80">
        <Canvas dpr={1} camera={{ position: [0, 0, 10], fov: 50 }}>
          <color attach="background" args={['transparent']} />
          <fog attach="fog" args={['#000', 10, 25]} />
          <ambientLight intensity={0.4} />
          <Particles count={20} color="#8b5cf6" />
          <Preload all />
        </Canvas>
      </div>
    );
  }
  
  // Standard version for normal devices
  return (
    <div className="absolute inset-0 z-0 opacity-80">
      <Canvas dpr={1} camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={['transparent']} />
        <fog attach="fog" args={['#000', 10, 25]} />
        <ambientLight intensity={0.4} />
        <Particles count={40} color="#8b5cf6" />
        <FloatingIcons />
        <Starfield count={100} />
        <Preload all />
      </Canvas>
    </div>
  );
};

export default HeroBackground;