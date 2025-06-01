import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Text, MeshDistortMaterial } from '@react-three/drei'

const FloatingDevices = (props) => {
  const group = useRef()

  // Animate the devices floating
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    
    if (group.current) {
      group.current.rotation.y = Math.sin(t / 4) * 0.3
      group.current.position.y = Math.sin(t / 2) * 0.2
    }
  })

  return (
    <group ref={group} {...props}>
      {/* Phone Model */}
      <mesh position={[-1.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.8, 0.1]} />
        <MeshDistortMaterial color={"#111827"} roughness={0.5} metalness={0.8} speed={2} distort={0.2} />
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[0.65, 1.4]} />
          <meshBasicMaterial color={"#0ea5e9"} toneMapped={false} />
        </mesh>
      </mesh>

      {/* Laptop Model */}
      <mesh position={[1.5, -0.2, 0]} rotation={[0.2, -0.3, 0]} castShadow receiveShadow>
        <group>
          {/* Laptop Screen */}
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[2, 1.4, 0.1]} />
            <MeshDistortMaterial color={"#111827"} roughness={0.5} metalness={0.8} speed={1} distort={0.1} />
            <mesh position={[0, 0, 0.06]}>
              <planeGeometry args={[1.8, 1.2]} />
              <meshBasicMaterial color={"#8b5cf6"} toneMapped={false} />
            </mesh>
          </mesh>
          
          {/* Laptop Base */}
          <mesh position={[0, -0.4, 0.4]} rotation={[-Math.PI / 6, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2, 0.2, 1.2]} />
            <MeshDistortMaterial color={"#111827"} roughness={0.5} metalness={0.8} speed={1} distort={0.05} />
          </mesh>
        </group>
      </mesh>

      {/* Floating Text */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#f3f4f6"
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        Chat & Connect
      </Text>
      
      {/* Particles/Orbs representing chat bubbles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 0.5) * 2.5,
            Math.cos(i * 0.8) * 1.5,
            Math.sin(i * 0.3) * 2
          ]}
          scale={[0.2 + Math.random() * 0.1, 0.2 + Math.random() * 0.1, 0.2 + Math.random() * 0.1]}
          castShadow
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <MeshDistortMaterial
            color={i % 2 === 0 ? "#06b6d4" : "#8b5cf6"}
            speed={4}
            distort={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

export default FloatingDevices
