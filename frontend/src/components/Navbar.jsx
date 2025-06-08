import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useFriends } from '../contexts/FriendContext';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { SocketContext } from "../contexts/SocketContext";
import UserAvatar from './UserAvatar';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { addFriend } = useFriends();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Refs
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Improved click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle user menu dropdown
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      
      // Handle mobile menu dropdown
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('[data-mobile-toggle]')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    setShowUserMenu(false);
    setShowMobileMenu(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get display name - use only AuthContext user
  const getDisplayName = () => {
    if (user) {
      if (user.displayName) return user.displayName;
      if (user.username) return user.username;
      if (user.name) return user.name;
      if (user.email) return user.email.split('@')[0];
    }
    return 'User';
  };

  // Add this new handler for auth-related navigation
  const handleAuthNavigation = (e, path) => {
    e.preventDefault();
    
    try {
      if (token || user) {
        // If user is logged in, redirect to dashboard instead
        navigate('/dashboard');
      } else {
        // Otherwise go to the intended auth page
        navigate(path);
      }
      
      // Close mobile menu if it's open
      setShowMobileMenu(false);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      window.location.href = path;
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-500">
              ChatConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {token ? (
              <>
                <Link
                  to="/chat"
                  className={`nav-link ${
                    isActive('/chat')
                      ? 'text-primary-400'
                      : 'text-dark-300 hover:text-primary-400'
                  } transition-colors duration-200`}
                >
                  Messages
                </Link>
                <Link
                  to="/ai-chat"
                  className={`nav-link ${
                    isActive('/ai-chat')
                      ? 'text-primary-400'
                      : 'text-dark-300 hover:text-primary-400'
                  } transition-colors duration-200`}
                >
                  AI Chat
                </Link>
                <Link
                  to="/gallery"
                  className={`nav-link ${
                    isActive('/gallery')
                      ? 'text-primary-400'
                      : 'text-dark-300 hover:text-primary-400'
                  } transition-colors duration-200`}
                >
                  Gallery
                </Link>

                {/* NotificationBell Component */}
                <NotificationBell />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-dark-300 hover:text-primary-400 transition-colors duration-200"
                  onClick={(e) => handleAuthNavigation(e, '/login')}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 text-white hover:from-primary-500 hover:to-indigo-400 transition-all duration-200"
                  onClick={(e) => handleAuthNavigation(e, '/signup')}
                >
                  Sign Up
                </Link>
              </>
            )}

            {token && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(prev => !prev)}
                  className="flex items-center space-x-3 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-2 py-1.5 transition-all duration-200"
                >
                  <UserAvatar user={user} size="md" />
                  <span className="text-dark-300 font-medium hidden sm:block">
                    {getDisplayName()}
                  </span>
                  <svg
                    className={`w-4 h-4 text-dark-300 transition-transform duration-200 ${
                      showUserMenu ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 rounded-lg bg-white dark:bg-gray-800 shadow-lg py-2 ring-1 ring-black ring-opacity-5"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <UserAvatar user={user} size="lg" />
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">{getDisplayName()}</p>
                            <p className="text-sm text-dark-300">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-dark-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary-400"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-dark-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary-400"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Settings
                        </Link>
                        <Link
                          to="/logout"
                          className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {token && <NotificationBell />}
            
            <button
              onClick={() => setShowMobileMenu(prev => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark-300 hover:text-primary-400 focus:outline-none"
              data-mobile-toggle="true"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {showMobileMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700"
            ref={mobileMenuRef}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {token ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <UserAvatar user={user} size="lg" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/chat"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/chat')
                        ? 'text-primary-400 bg-gray-50 dark:bg-gray-700/50'
                        : 'text-dark-300 hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Messages
                  </Link>
                  <Link
                    to="/ai-chat"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/ai-chat')
                        ? 'text-primary-400 bg-gray-50 dark:bg-gray-700/50'
                        : 'text-dark-300 hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    AI Chat
                  </Link>
                  <Link
                    to="/gallery"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/gallery')
                        ? 'text-primary-400 bg-gray-50 dark:bg-gray-700/50'
                        : 'text-dark-300 hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                    aria-label="Gallery"
                  >
                    Gallery
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    onClick={() => setShowMobileMenu(false)}
                    aria-label="Profile"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    onClick={() => setShowMobileMenu(false)}
                    aria-label="Settings"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    onClick={(e) => handleAuthNavigation(e, '/login')}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    onClick={(e) => handleAuthNavigation(e, '/signup')}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
