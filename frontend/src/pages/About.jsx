import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const About = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-500">
                About ChatConnect
              </span>
            </h1>
            <p className="text-xl text-dark-300 max-w-3xl mx-auto">
              Revolutionizing communication through AI-powered conversations and real-time messaging
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
              <p className="text-dark-300 text-lg leading-relaxed mb-6">
                At ChatConnect, we believe that communication should be seamless, intelligent, and accessible to everyone. 
                Our platform combines cutting-edge AI technology with intuitive design to create the ultimate messaging experience.
              </p>
              <p className="text-dark-300 text-lg leading-relaxed">
                Whether you're connecting with friends, collaborating with colleagues, or seeking AI assistance, 
                ChatConnect provides the tools you need to communicate effectively in today's digital world.
              </p>
            </div>
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-br from-primary-500/20 to-indigo-500/20 rounded-2xl p-8 backdrop-blur-sm border border-primary-500/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-400">10K+</div>
                    <div className="text-dark-300">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-400">50M+</div>
                    <div className="text-dark-300">Messages Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">99.9%</div>
                    <div className="text-dark-300">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">24/7</div>
                    <div className="text-dark-300">AI Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Breakdown */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-white">What Makes Us Different</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Lightning Fast</h3>
                <p className="text-dark-300">Real-time messaging with zero lag, powered by advanced WebSocket technology.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">AI-Powered</h3>
                <p className="text-dark-300">Smart assistance and intelligent conversation features that learn and adapt.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Secure</h3>
                <p className="text-dark-300">End-to-end encryption ensures your conversations remain private and secure.</p>
              </div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-white">Built by Innovators</h2>
            <p className="text-dark-300 text-lg max-w-3xl mx-auto mb-8">
              Our team of passionate developers, designers, and AI specialists work tirelessly to bring you 
              the most advanced communication platform. We're committed to continuous innovation and user satisfaction.
            </p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 text-white font-medium hover:from-primary-500 hover:to-indigo-400 transition-all duration-300"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About
