import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        { 
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      login(res.data.user, res.data.token);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check your connection.');
      } else if (err.response?.status === 401) {
        setError(err.response.data?.error || 'Invalid email or password.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(
          err?.response?.data?.error ||
          err?.message ||
          'Login failed. Please try again.'
        );
      }
    }
  };

  return (
    <Motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-dark-900 p-4 pt-20"
    >
      <Motion.div 
        className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white dark:bg-dark-800"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Motion.h2 
          className="text-3xl font-bold mb-6 text-center gradient-text"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome Back
        </Motion.h2>
        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}
        <Motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-5"
        >
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

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-400"
              />
              <label htmlFor="remember-me" className="ml-2 text-dark-700 dark:text-dark-400">
                Remember me
              </label>
            </div>
            <a href="#" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
              Forgot password?
            </a>
          </div>

          <Motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-primary-600 to-primary-400 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign in'}
          </Motion.button>
        </Motion.form>

        <Motion.div 
          className="mt-6 text-center text-sm text-dark-600 dark:text-dark-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-medium">
            Create one
          </Link>
        </Motion.div>
      </Motion.div>
    </Motion.div>
  );
};

export default LoginPage;
