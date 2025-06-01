import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CallToActionSection = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="parallax-section absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-800/20 to-indigo-600/20"></div>
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-30"></div>
    </div>
    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Ready to Transform Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Communication</span>?
        </h2>
        <p className="text-xl text-dark-200 mb-10">
          Join thousands of users already experiencing the future of messaging
          and AI interaction.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Link
            to="/signup"
            className="px-10 py-4 bg-gradient-to-r from-primary-500 to-indigo-500 text-white text-lg font-medium rounded-full shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300"
          >
            Start For Free
          </Link>
        </motion.div>
        <p className="mt-6 text-dark-400">
          No credit card required. 14-day free trial.
        </p>
      </motion.div>
    </div>
  </section>
);

export default CallToActionSection;
