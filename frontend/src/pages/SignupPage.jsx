import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // add useNavigate
// eslint-disable-next-line
import { motion } from 'framer-motion';
import axios from 'axios';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // initialize navigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!import.meta.env.VITE_API_URL) {
      setError('API URL is not set. Please check your environment configuration.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password
        },
        {
          withCredentials: true,
          timeout: 30000, // Increased to 30 seconds
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Signup successful:', response.data);
      setLoading(false);
      
      // Show success message before redirecting
      setError('');
      alert('Account created successfully! Redirecting to login...');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      
    } catch (err) {
      setLoading(false);
      console.error('Signup error:', err, err?.response);
      
      // Better error handling
      if (err.code === 'ECONNABORTED') {
        setError(
          'Request timed out. The backend server may be waking up or is slow to respond. ' +
          'Please wait a few seconds and try again. ' +
          'Backend URL: ' + import.meta.env.VITE_API_URL
        );
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if the backend is running at ' + import.meta.env.VITE_API_URL);
      } else if (err.response?.status === 400) {
        setError(err.response.data?.error || 'Invalid input. Please check your details.');
      } else if (err.response?.status === 409) {
        setError('An account with this email or username already exists.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(
          err?.response?.data?.error ||
          err?.message ||
          'Signup failed. Please try again.'
        );
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-dark-900 p-4 pt-20"
    >
      <motion.div 
        className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white dark:bg-dark-800"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-6 text-center gradient-text"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Create Account
        </motion.h2>
        
        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:border-dark-600 focus:border-primary-400 focus:ring focus:ring-primary-200 dark:focus:ring-primary-900 dark:focus:border-primary-600 focus:outline-none transition bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:border-dark-600 focus:border-primary-400 focus:ring focus:ring-primary-200 dark:focus:ring-primary-900 dark:focus:border-primary-600 focus:outline-none transition bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:border-dark-600 focus:border-primary-400 focus:ring focus:ring-primary-200 dark:focus:ring-primary-900 dark:focus:border-primary-600 focus:outline-none transition bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:border-dark-600 focus:border-primary-400 focus:ring focus:ring-primary-200 dark:focus:ring-primary-900 dark:focus:border-primary-600 focus:outline-none transition bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-primary-600 to-primary-400 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg mt-2"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </motion.button>
        </motion.form>

        <motion.div 
          className="mt-6 text-center text-sm text-dark-600 dark:text-dark-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign in
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SignupPage;
