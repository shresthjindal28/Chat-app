import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { AuthContext } from '../contexts/AuthContext';
import { useFriends } from '../contexts/FriendContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';
import axios from 'axios';

// Avatar component to handle both image and text fallback
const UserAvatar = ({ user, size = 'md' }) => {
  // Determine sizes based on the size prop
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10",
    xl: "w-12 h-12"
  };

  // Get profile image URL
  const getProfileImageUrl = () => {
    if (user) {
      if (user.profileImage) return user.profileImage;
      if (user.avatar) return user.avatar;
      if (user.photoURL) return user.photoURL;
      if (user.picture) return user.picture;
    }
    return null;
  };

  // Get display name for fallback text
  const getName = () => {
    if (user) {
      if (user.displayName) return user.displayName;
      if (user.username) return user.username;
      if (user.name) return user.name;
      if (user.email) return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitial = () => {
    const name = getName();
    return name !== 'User' ? name.charAt(0).toUpperCase() : 'U';
  };

  const profileImageUrl = getProfileImageUrl();

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-400 to-secondary-500`}>
      {profileImageUrl ? (
        <img 
          src={profileImageUrl} 
          alt="Profile" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.style.display = 'none';
            e.target.parentNode.classList.add('flex', 'items-center', 'justify-center', 'text-white');
            e.target.parentNode.innerHTML = getUserInitial();
          }}
        />
      ) : (
        <span className="text-white font-bold">
          {getUserInitial()}
        </span>
      )}
    </div>
  );
};

// New NotificationItem component
const NotificationItem = ({ notification, onAction, onMarkAsRead }) => {
  const { sender, type, content, createdAt, read } = notification;
  const navigate = useNavigate();

  const handleClick = () => {
    if (!read) {
      onMarkAsRead(notification._id);
    }
    
    switch (type) {
      case 'friend_request':
        // Handle friend request click
        break;
      case 'message':
        navigate('/chat');
        break;
      case 'friend_accepted':
        navigate('/chat');
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = () => {
    switch (type) {
      case 'friend_request':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'message':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      onClick={handleClick}
      className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200 ${
        !read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <UserAvatar user={sender} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {sender?.displayName || sender?.username || 'Unknown User'}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(createdAt)}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {content}
          </p>
          {type === 'friend_request' && (
            <div className="mt-2 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(notification._id, 'accept');
                }}
                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Accept
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(notification._id, 'decline');
                }}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// New NotificationDropdown component
const NotificationDropdown = ({ 
  notifications, 
  onMarkAsRead, 
  onClearAll, 
  onAction,
  onClose 
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onAction={onAction}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { friends, addFriend, removeFriend } = useFriends();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Add back the refs
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Add back click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/notifications`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setNotifications(response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    if (!token) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    if (!token) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/notifications/clear-all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Handle friend request actions
  const handleFriendRequest = async (notificationId, action) => {
    if (!token) return;

    try {
      const notification = notifications.find(n => n._id === notificationId);
      if (!notification) return;

      if (action === 'accept') {
        await addFriend(notification.sender._id);
        await markNotificationAsRead(notificationId);
      } else if (action === 'decline') {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/user/friend-requests/${notificationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error handling friend request:', error);
    }
  };

  // Fetch notifications on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    setShowNotifications(false);
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

                {/* New Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600 dark:text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <NotificationDropdown
                        notifications={notifications}
                        onMarkAsRead={markNotificationAsRead}
                        onClearAll={clearAllNotifications}
                        onAction={handleFriendRequest}
                        onClose={() => setShowNotifications(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-dark-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 text-white hover:from-primary-500 hover:to-indigo-400 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}

            <ThemeToggle />

            {token && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
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

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white dark:bg-gray-800 shadow-lg py-2 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <UserAvatar user={user} size="lg" />
                        <div>
                          <p className="text-white font-medium">{getDisplayName()}</p>
                          <p className="text-sm text-dark-300">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-dark-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary-400"
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
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            {token && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                >
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <NotificationDropdown
                      notifications={notifications}
                      onMarkAsRead={markNotificationAsRead}
                      onClearAll={clearAllNotifications}
                      onAction={handleFriendRequest}
                      onClose={() => setShowNotifications(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark-300 hover:text-primary-400 focus:outline-none"
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
                  >
                    Gallery
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
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
