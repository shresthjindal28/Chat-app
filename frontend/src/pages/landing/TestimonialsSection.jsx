import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Alex Morgan",
    role: "Software Developer",
    image: "/images/avatar1.jpg",
    text: "The AI assistance feature has revolutionized how I communicate with my team. It saves me hours every week!"
  },
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    image: "/images/avatar2.jpg",
    text: "I've tried many chat platforms, but this one stands out with its beautiful interface and powerful features."
  },
  {
    name: "Michael Chen",
    role: "Product Designer",
    image: "/images/avatar3.jpg",
    text: "The real-time collaboration tools have made remote work so much easier for our entire design team."
  }
];

const TestimonialsSection = () => (
  <section className="py-20 bg-dark-900/70">
    <div className="container mx-auto px-4">
      <motion.h2
        className="text-4xl md:text-5xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        What Our Users <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Say</span>
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            className="bg-dark-800/50 p-6 rounded-xl backdrop-blur-sm border border-dark-700/50"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                {testimonial.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-white">{testimonial.name}</h4>
                <p className="text-dark-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <div className="mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-dark-300 italic">{testimonial.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
