import React from 'react';

const DocsPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-dark-900 p-8">
    <div className="max-w-3xl w-full bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-4 text-primary-500">Documentation</h1>
      <p className="text-lg text-dark-700 dark:text-dark-300 mb-4">
        Welcome to the ChatConnect documentation. Here you'll find guides, API references, and tips to get the most out of the platform.
      </p>
      <ul className="list-disc pl-6 text-dark-600 dark:text-dark-400 mb-2">
        <li>Getting Started</li>
        <li>API Reference</li>
        <li>Troubleshooting</li>
        <li>FAQ</li>
      </ul>
      <p className="text-dark-500 dark:text-dark-400 text-sm mt-4">
        For more help, contact our support team via the Contact page.
      </p>
    </div>
  </div>
);

export default DocsPage;
