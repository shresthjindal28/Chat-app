import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, RoundedBox } from '@react-three/drei'

const ChatBubble = ({ position, message, font = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZs.woff', color = '#8B5CF6' }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.05
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <RoundedBox args={[1.2, 0.6, 0.1]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </RoundedBox>
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.06}
        maxWidth={1}
        lineHeight={1.2}
        textAlign="center"
        font={font}
        color="#ffffff"
      >
        {message}
      </Text>
    </group>
  )
}

const CircleOfChatBubbles = ({ count = 8, radius = 2, messages = [] }) => {
  const bubbles = useMemo(() => {
    const items = []
    const defaultMessages = [
      "Hello there!",
      "How are you?",
      "Let's chat!",
      "AI at your service",
      "Welcome back!",
      "What's new?",
      "Need help?",
      "Let's connect"
    ]
    
    const msgs = messages.length >= count ? messages : [...messages, ...defaultMessages].slice(0, count)
    const colors = ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6']
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const x = Math.sin(angle) * radius
      const z = Math.cos(angle) * radius
      const y = Math.sin(i * 0.5) * 0.2
      const color = colors[i % colors.length]
      
      items.push(
        <ChatBubble 
          key={i} 
          position={[x, y, z]} 
          message={msgs[i]} 
          color={color}
        />
      )
    }
    return items
  }, [count, radius, messages])
  
  return <>{bubbles}</>
}

const ChatScene = ({ messages = [] }) => {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <CircleOfChatBubbles messages={messages} />
      <ambientLight intensity={0.5} />
      <spotLight 
        position={[5, 5, 5]} 
        angle={0.3} 
        penumbra={1} 
        intensity={1} 
        castShadow 
      />
      <Float 
        speed={2} 
        rotationIntensity={0.5} 
        floatIntensity={0.5}
      >
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color="#8B5CF6" metalness={0.1} roughness={0.2} />
        </mesh>
        <mesh position={[-0.8, -0.8, 0]} castShadow>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#8B5CF6" metalness={0.1} roughness={0.2} />
        </mesh>
        <mesh position={[-1.2, -1.2, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#8B5CF6" metalness={0.1} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  )
}

export default ChatScene
