import React from 'react';

const AboutPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-dark-900 p-8">
    <div className="max-w-2xl w-full bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-4 text-primary-500">About Us</h1>
      <p className="text-lg text-dark-700 dark:text-dark-300 mb-4">
        ChatConnect is a modern communication platform featuring real-time chat, AI assistance, image sharing, notifications, and user management.
      </p>
      <p className="text-dark-600 dark:text-dark-400">
        Our mission is to make communication seamless, fun, and productive for everyone. Built with React, Express, MongoDB, and Socket.IO.
      </p>
    </div>
  </div>
);

export default AboutPage;
