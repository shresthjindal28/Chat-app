import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import FloatingOrbs from './FloatingOrbs'

const ThreeBackground = ({ orbs = 15, controls = false, cameraPosition = [0, 0, 10], children }) => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={cameraPosition} fov={45} />
          <color attach="background" args={['#050816']} />
          <fog attach="fog" args={['#050816', 5, 20]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.6} />
          <FloatingOrbs count={orbs} />
          {controls && <OrbitControls enableZoom={false} enablePan={false} />}
          {/* Optionally render children inside the Canvas */}
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}

export default ThreeBackground
