import React, { useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import FloatingOrbs from '../components/three/FloatingOrbs';

const MotionLink = motion(Link);

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const containerRef = useRef(null);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  // Dashboard features configuration
  const dashboardFeatures = [
    { to: "/chat", icon: "💬", title: "Chat", color: "from-primary-500 to-indigo-600", description: "Connect and message with friends" },
    { to: "/ai-chat", icon: "🤖", title: "AI Chatbot", color: "from-green-500 to-emerald-600", description: "Get help from our intelligent assistant" },
    { to: "/gallery", icon: "🖼️", title: "Gallery", color: "from-amber-500 to-orange-600", description: "View and share your photos" },
    { to: "/profile", icon: "🙋", title: "Profile", color: "from-rose-500 to-pink-600", description: "Manage your personal information" },
    { to: "/find-users", icon: "👥", title: "Find Users", color: "from-blue-500 to-cyan-600", description: "Discover new connections" },
    { to: "/settings", icon: "⚙️", title: "Settings", color: "from-slate-500 to-slate-600", description: "Customize your experience" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-20">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} />
            <FloatingOrbs count={10} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Suspense>
        </Canvas>
      </div>
      
      <motion.div
        ref={containerRef}
        className="relative z-10 container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="bg-dark-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mb-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full opacity-75 blur-sm"></div>
              <img
                src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.username}&background=8B5CF6&color=fff`}
                alt="Profile"
                className="relative w-24 h-24 rounded-full object-cover"
              />
            </motion.div>
            
            <div className="text-center md:text-left">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Welcome, <span className="gradient-text">{user?.username}</span>!
              </motion.h1>
              <motion.p 
                className="text-dark-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {user?.email} • {new Date().toLocaleDateString()}
              </motion.p>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardFeatures.map((feature, index) => (
            <MotionLink
              key={feature.to}
              to={feature.to}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.03, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-dark-800/80 backdrop-blur-md rounded-xl p-6 flex flex-col h-full shadow-lg border border-dark-700 overflow-hidden relative group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="flex items-center mb-4">
                <div className={`bg-gradient-to-r ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="ml-4 text-xl font-bold text-white">{feature.title}</h3>
              </div>
              
              <p className="text-dark-300 text-sm flex-grow">{feature.description}</p>
              
              <div className="flex justify-end mt-4">
                <motion.div 
                  className={`arrow-icon text-sm bg-gradient-to-r ${feature.color} rounded-full w-8 h-8 flex items-center justify-center`}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  →
                </motion.div>
              </div>
            </MotionLink>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-dark-800/60 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto"
        >
          <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Messages", value: "24", icon: "✉️" },
              { label: "Connections", value: "128", icon: "🔗" },
              { label: "Notifications", value: "5", icon: "🔔" },
              { label: "Tasks", value: "12", icon: "✓" },
            ].map((stat, index) => (
              <div key={index} className="bg-dark-700/50 rounded-lg p-4 flex items-center">
                <div className="text-2xl mr-3">{stat.icon}</div>
                <div>
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-sm text-dark-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;