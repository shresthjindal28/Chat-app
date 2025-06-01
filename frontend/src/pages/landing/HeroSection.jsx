import React, { useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FloatingDevices from '../../components/three/FloatingDevices';
import { AuthContext } from '../../contexts/AuthContext';
import gsap from 'gsap';

const HeroSection = () => {
  const { user } = useContext(AuthContext);
  const textRef = useRef(null);

  // Mouse hover effect for 3D text
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!textRef.current) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = textRef.current.getBoundingClientRect();
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      gsap.to(textRef.current, {
        duration: 0.8,
        rotationY: x * 10,
        rotationX: -y * 10,
        ease: 'power2.out',
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      {/* 3D Scene */}
      <div className="three-scene-container absolute w-full h-full top-0 left-0 z-0 pointer-events-none opacity-80">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[-5, 5, 5]} intensity={0.8} castShadow />
          <FloatingDevices position={[0, -1, 0]} scale={[0.8, 0.8, 0.8]} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} />
        </Canvas>
      </div>
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1
          ref={textRef}
          className="hero-title text-6xl md:text-8xl font-extrabold mb-8"
        >
          <motion.span
            className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-500"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Chat
          </motion.span>{' '}
          <motion.span
            className="inline-block dark:text-white"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            &
          </motion.span>{' '}
          <motion.span
            className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-primary-500"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect
          </motion.span>
        </h1>
        <motion.p
          className="hero-subtitle text-xl md:text-2xl mb-12 text-dark-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Experience the next generation of communication with AI-powered chat,
          real-time messaging, and stunning visuals.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {user ? (
            <motion.div
              className="hero-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/dashboard"
                className="relative overflow-hidden group px-8 py-4 rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 text-white font-medium text-lg shadow-lg shadow-primary-500/20"
              >
                <span className="relative z-10">Go to Dashboard</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110" />
                <span className="absolute -inset-px rounded-full bg-gradient-to-r from-primary-300 to-indigo-300 opacity-70 group-hover:opacity-100 blur-sm transition-all duration-300 group-hover:blur-md"></span>
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="hero-button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/signup"
                  className="relative overflow-hidden group px-8 py-4 rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 text-white font-medium text-lg shadow-lg shadow-primary-500/20"
                >
                  <span className="relative z-10">Get Started</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110" />
                  <span className="absolute -inset-px rounded-full bg-gradient-to-r from-primary-300 to-indigo-300 opacity-70 group-hover:opacity-100 blur-sm transition-all duration-300 group-hover:blur-md"></span>
                </Link>
              </motion.div>
              <motion.div
                className="hero-button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/login"
                  className="relative overflow-hidden group px-8 py-4 rounded-full border-2 border-primary-400/30 font-medium text-lg hover:shadow-lg transition duration-300"
                >
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-300">
                    Login
                  </span>
                  <span className="absolute inset-0 bg-dark-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>
            </>
          )}
        </div>
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <svg
            className="w-6 h-6 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
