import React from 'react';

const ContactPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-dark-900 p-8">
    <div className="max-w-2xl w-full bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-4 text-primary-500">Contact Us</h1>
      <p className="text-lg text-dark-700 dark:text-dark-300 mb-4">
        Have questions, feedback, or need support? Reach out to our team!
      </p>
      <ul className="text-dark-600 dark:text-dark-400 mb-2">
        <li>Email: <a href="mailto:support@chatconnect.com" className="text-primary-500">support@chatconnect.com</a></li>
        <li>Twitter: <a href="https://twitter.com/" className="text-primary-500" target="_blank" rel="noopener noreferrer">@ChatConnect</a></li>
      </ul>
      <p className="text-dark-500 dark:text-dark-400 text-sm">We typically respond within 24 hours.</p>
    </div>
  </div>
);

export default ContactPage;
