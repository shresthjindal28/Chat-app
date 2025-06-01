import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '💬',
    title: 'Real-time Chat',
    desc: 'Connect with friends instantly with encrypted messaging, rich media sharing, and presence indicators.',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: '🤖',
    title: 'AI Assistance',
    desc: 'Get intelligent responses, content suggestions, and automated tasks with our advanced AI model.',
    color: 'from-primary-500 to-primary-700'
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    desc: 'End-to-end encryption, comprehensive privacy controls, and secure data storage protect your conversations.',
    color: 'from-indigo-500 to-purple-600'
  }
];

const FeaturesSection = () => (
  <section className="py-20 bg-dark-900/90 parallax-trigger">
    <div className="container mx-auto px-4">
      <motion.h2
        className="text-4xl md:text-5xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Features</span>
      </motion.h2>
      <motion.p
        className="text-xl text-dark-300 text-center max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Discover why thousands of users choose our platform for their communication needs
      </motion.p>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="feature-card group relative bg-gradient-to-br from-dark-800/80 to-dark-700/80 p-8 rounded-2xl backdrop-blur-sm border border-dark-700/50 hover:border-primary-500/50 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300`}></div>
            <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-indigo-400 transition-all duration-300">
              {feature.title}
            </h3>
            <p className="text-dark-300 group-hover:text-dark-200 transition-colors duration-300">{feature.desc}</p>
            <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Link to="/features" className="text-primary-400 flex items-center">
                Learn more
                <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
