import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => (
  <section className="py-20 bg-dark-900/90">
    <div className="container mx-auto px-4">
      <motion.h2
        className="text-4xl md:text-5xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">ChatApp</span>
      </motion.h2>
      <motion.p
        className="text-xl text-dark-300 text-center max-w-3xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        ChatApp is a modern communication platform that combines real-time messaging, AI-powered assistance, and beautiful design to help you connect, collaborate, and get things done.
      </motion.p>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <motion.div
          className="bg-dark-800/70 rounded-xl p-6 shadow-lg max-w-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold mb-2 text-white">Our Mission</h3>
          <p className="text-dark-300">
            To empower people everywhere to communicate effortlessly and securely, using the latest advancements in AI and technology.
          </p>
        </motion.div>
        <motion.div
          className="bg-dark-800/70 rounded-xl p-6 shadow-lg max-w-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h3 className="text-2xl font-semibold mb-2 text-white">Why Choose Us?</h3>
          <ul className="list-disc pl-5 text-dark-300 space-y-1">
            <li>Real-time, secure messaging</li>
            <li>AI-powered productivity tools</li>
            <li>Modern, intuitive interface</li>
            <li>Privacy-first approach</li>
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
