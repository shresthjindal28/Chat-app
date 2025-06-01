import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingOrbs = ({ count = 10 }) => {
  const mesh = useRef();
  // Store original positions separately for animation
  const originalPositions = useRef([]);

  // Generate random positions and speeds
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const position = [
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      ];
      const speed = Math.random() * 0.5 + 0.2;
      const phase = Math.random() * Math.PI * 2;
      const color = new THREE.Color();
      
      // Generate colors in purple/blue spectrum
      color.setHSL(
        0.6 + Math.random() * 0.2, // hue (purple/blue range)
        0.7 + Math.random() * 0.3, // saturation
        0.5 + Math.random() * 0.3  // lightness
      );
      
      const size = Math.random() * 1 + 0.5;
      
      temp.push({ position, speed, phase, color, size });
    }
    originalPositions.current = temp.map(p => [...p.position]);
    return temp;
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.getElapsedTime();
    particles.forEach((particle, i) => {
      const [ox, oy, oz] = originalPositions.current[i];
      mesh.current.geometry.attributes.position.setXYZ(
        i,
        ox + Math.sin(time * particle.speed + particle.phase) * 0.5,
        oy + Math.cos(time * particle.speed + particle.phase) * 0.5,
        oz + Math.sin(time * particle.speed + particle.phase + Math.PI) * 0.5
      );
    });
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={Float32Array.from(particles.flatMap(p => p.position))}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.length}
          array={Float32Array.from(particles.flatMap(p => [p.color.r, p.color.g, p.color.b]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
      />
    </points>
  );
};

export default FloatingOrbs;
