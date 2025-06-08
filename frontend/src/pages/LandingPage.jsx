import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-6 rounded-2xl bg-dark-800/50 backdrop-blur-lg border border-dark-700/50 hover:border-primary-500/30 transition-all duration-300 group hover:transform hover:scale-105"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-dark-300">{description}</p>
  </motion.div>
);

const ParticleElement = ({ delay, size = "w-2 h-2" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      y: [0, -100],
    }}
    transition={{
      duration: 3,
      delay: delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 3,
    }}
    className={`absolute bg-gradient-to-r from-primary-400 to-indigo-400 rounded-full ${size}`}
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
  />
);

const AnimatedSVG = () => (
  <motion.svg
    width="300"
    height="200"
    viewBox="0 0 300 200"
    className="absolute top-20 right-10 opacity-10"
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <motion.path
      d="M50,100 Q150,50 250,100 Q150,150 50,100"
      fill="none"
      stroke="url(#gradient1)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle
      cx="150"
      cy="100"
      r="30"
      fill="none"
      stroke="url(#gradient1)"
      strokeWidth="1"
      initial={{ scale: 0 }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.svg>
);

const PagePreviewCard = ({ icon, title, description, route, image }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/80 backdrop-blur-lg border border-dark-700/50 hover:border-primary-500/30 transition-all duration-500"
  >
    <Link to={route} className="block h-full w-full">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Mock screenshot/preview */}
      <div className="h-48 bg-gradient-to-br from-dark-700 to-dark-800 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-indigo-500/20"
          animate={{
            background: [
              "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
              "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-4 left-4 w-3 h-3 bg-primary-400/50 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-4 right-4 w-2 h-2 bg-indigo-400/50 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-dark-300 mb-4 leading-relaxed">{description}</p>

        <motion.div
          className="flex items-center text-primary-400 font-medium group-hover:text-indigo-400 transition-colors duration-300"
          whileHover={{ x: 5 }}
        >
          Explore Page
          <motion.svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </motion.svg>
        </motion.div>
      </div>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ scale: 0.8 }}
        whileHover={{ scale: 1 }}
      />
    </Link>
  </motion.div>
);

const LandingPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-hidden">
      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <ParticleElement key={i} delay={i * 0.2} />
      ))}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        {/* Animated SVG */}
        <AnimatedSVG />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            className="absolute -top-20 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 flex items-center justify-center">
              <motion.svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </motion.svg>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-500"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Chat
            </motion.span>
            <span className="text-white"> & </span>
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-primary-500"
              animate={{
                backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Connect
            </motion.span>

            {/* Decorative elements around title */}
            <motion.div
              className="absolute -top-5 -left-5 w-3 h-3 bg-primary-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-5 -right-5 w-4 h-4 bg-indigo-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-dark-300 mb-12 max-w-3xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              className="inline-block"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            >
              Experience
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
            >
              seamless
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            >
              communication
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              with
            </motion.span>{" "}
            <motion.span
              className="inline-block text-primary-400"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            >
              AI-powered
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              chat,
            </motion.span>{" "}
            <motion.span
              className="inline-block text-indigo-400"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              real-time
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            >
              messaging,
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
            >
              and
            </motion.span>{" "}
            <motion.span
              className="inline-block text-purple-400"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
            >
              stunning
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.0 }}
            >
              visuals.
            </motion.span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            
                  <motion.div
                    className="absolute -left-4 sm:-left-10 top-1/2 w-2 h-2 bg-primary-400 rounded-full hidden sm:block"
                    animate={{
                    x: [0, 10, 0],
                    opacity: [0.3, 1, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -right-4 sm:-right-10 top-1/2 w-2 h-2 bg-indigo-400 rounded-full hidden sm:block"
                    animate={{
                    x: [0, -10, 0],
                    opacity: [0.3, 1, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  />

                  {user ? (
                    <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                    >
                    <Link
                      to="/dashboard"
                      className="block w-full sm:inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 text-white font-medium text-base sm:text-lg hover:from-primary-500 hover:to-indigo-400 transition-all duration-300 relative overflow-hidden group text-center"
                    >
                      <span className="relative z-10">Go to Dashboard</span>
                      <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                      />
                    </Link>
                    </motion.div>
                  ) : (
                    <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto"
                    >
                      <Link
                      to="/signup"
                      className="relative group block w-full sm:inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 text-white font-medium text-base sm:text-lg hover:from-primary-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-primary-500/25 overflow-hidden text-center"
                      >
                      <span className="relative z-10">Get Started</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto"
                    >
                      <Link
                      to="/login"
                      className="block w-full sm:inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-primary-400/40 text-primary-400 font-medium text-base sm:text-lg hover:text-white hover:bg-primary-400/20 transition-all duration-300 text-center"
                      >
                      Login
                      </Link>
                    </motion.div>
                    </>
                  )}
                  </motion.div>
                </div>

                
                  <motion.div
                    className="absolute bottom-6 sm:bottom-10  flex flex-col items-center justify-center w-full px-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-primary-400 text-xs sm:text-sm mb-2 font-medium">
                        Scroll to explore
                      </span>
                      <motion.svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </motion.svg>
                    </motion.div>
                  </motion.div>
                      </section>

                      {/* Features Section */}
      <section className="py-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 border border-primary-500/10 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-24 h-24 border border-indigo-500/10 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container mx-auto relative">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-500"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Powerful Features
            </motion.span>

            {/* Decorative lines */}
            <motion.div
              className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent w-20"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div
              className="absolute top-1/2 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent w-20"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <motion.svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </motion.svg>
              }
              title="Real-time Chat"
              description="Experience instant messaging with real-time updates and seamless communication."
            />

            <FeatureCard
              icon={
                <motion.svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </motion.svg>
              }
              title="AI-Powered Chat"
              description="Engage with our advanced AI assistant for intelligent conversations and assistance."
            />

            <FeatureCard
              icon={
                <motion.svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </motion.svg>
              }
              title="Media Gallery"
              description="Share and view images in a beautiful, organized gallery interface."
            />
          </div>
        </div>
      </section>

      {/* Pages Preview Section */}
      <section className="py-20 px-4 relative bg-dark-900/50">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1], rotate: [180, 270, 360] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 relative"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400">
                Explore All Features
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-dark-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover every aspect of our platform designed to enhance your
              communication experience
            </motion.p>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex space-x-2"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary-400/30 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <PagePreviewCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              }
              title="Real-time Chat"
              description="Connect instantly with friends and colleagues through our seamless messaging interface with typing indicators and emoji support."
              route="/chat"
            />

            <PagePreviewCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
              title="AI Assistant"
              description="Engage with our advanced AI chatbot for intelligent conversations, quick answers, and personalized assistance."
              route="/ai-chat"
            />

            <PagePreviewCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              title="Media Gallery"
              description="Organize and share your photos in a beautiful gallery with advanced filtering and sorting capabilities."
              route="/gallery"
            />

            <PagePreviewCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
              title="User Profile"
              description="Customize your profile, manage settings, and track your activity with detailed analytics and preferences."
              route="/profile"
            />

            <PagePreviewCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              title="Dashboard"
              description="Get a comprehensive overview of your activity, recent chats, AI interactions, and system analytics."
              route="/dashboard"
            />

            <PagePreviewCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
              title="Settings"
              description="Personalize your experience with theme customization, notification preferences, and privacy controls."
              route="/settings"
            />

            <PagePreviewCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
              title="Contact Us"
              description="Get in touch with our support team, send feedback, or reach out for business inquiries and partnerships."
              route="/contact"
            />

            <PagePreviewCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              }
              title="Documentation"
              description="Access comprehensive guides, API documentation, tutorials, and help resources to get the most out of our platform."
              route="/docs"
            />

            <PagePreviewCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="About Us"
              description="Learn about our mission, team, company values, and the story behind our innovative communication platform."
              route="/about"
            />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-dark-900 border-t border-dark-700/50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 left-1/4 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 right-1/4 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="container mx-auto px-4 py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <motion.h3
                className="text-2xl font-bold mb-4"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-500">
                  Chat & Connect
                </span>
              </motion.h3>
              <p className="text-dark-300 mb-6 leading-relaxed">
                Experience the future of communication with our AI-powered chat
                platform, real-time messaging, and stunning visual interfaces.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {/* Social links can be added here */}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 grid grid-cols-2 gap-8"
            >
              <div>
                <motion.h4
                  className="text-lg font-semibold mb-4"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-500">
                    Product
                  </span>
                </motion.h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/about"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/features"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pricing"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <motion.h4
                  className="text-lg font-semibold mb-4"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-500">
                    Resources
                  </span>
                </motion.h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/docs"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/changelog"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      Changelog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/support"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <motion.h4
                  className="text-lg font-semibold mb-4"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-500">
                    Legal
                  </span>
                </motion.h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/terms"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cookies"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/accessibility"
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      Accessibility
                    </Link>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Footer bottom text */}
          <div className="border-t border-dark-700 pt-8 mt-8 text-center text-dark-300">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Chat & Connect. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
