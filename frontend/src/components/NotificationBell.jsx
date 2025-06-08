import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SocketContext } from "../contexts/SocketContext";
import NotificationDropdown from "./NotificationDropdown";
import { AuthContext } from "../contexts/AuthContext";
import { useFriends } from "../contexts/FriendContext";
import api from '../utils/axiosConfig';

// Add bell animation keyframes
const addBellAnimation = () => {
  if (typeof document !== 'undefined' && !document.querySelector('#bell-animation-style')) {
    const style = document.createElement('style');
    style.id = 'bell-animation-style';
    style.textContent = `
      @keyframes bell-ring {
        0% { transform: rotate(0deg); }
        20% { transform: rotate(10deg); }
        40% { transform: rotate(-10deg); }
        60% { transform: rotate(5deg); }
        80% { transform: rotate(-5deg); }
        100% { transform: rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
  }
};

const NotificationBell = () => {
  const { token } = useContext(AuthContext);
  const { fetchFriends } = useFriends();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  // Add bell animation CSS
  useEffect(() => {
    addBellAnimation();
  }, []);
  
  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;
    
    const handleNew = notif => {
      setNotifications(prev => [notif, ...prev]);
      // Trigger bell animation when new notification comes in
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 2000);
      setHasUnread(true);
    };
    
    const handleUpdate = notif => setNotifications(prev => 
      prev.map(n => n._id === notif._id ? notif : n)
    );
    
    const handleDelete = notifId => setNotifications(prev => 
      prev.filter(n => n._id !== notifId)
    );
    
    socket.on("notification:new", handleNew);
    socket.on("notification:update", handleUpdate);
    socket.on("notification:delete", handleDelete);
    
    return () => {
      socket.off("notification:new", handleNew);
      socket.off("notification:update", handleUpdate);
      socket.off("notification:delete", handleDelete);
    };
  }, [socket]);
  
  // Calculate unread notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const unreadExists = notifications.some(notif => !notif.read);
      setHasUnread(unreadExists);
    } else {
      setHasUnread(false);
    }
  }, [notifications]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/user/notifications');

      if (response.data && Array.isArray(response.data)) {
        setNotifications(response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    if (!token) return;

    try {
      await api.post(
        `/api/user/notifications/${notificationId}/read`,
        {}
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
      await api.delete(
        '/api/user/notifications'
      );
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Handle friend requests
  const handleFriendRequest = async (notificationId, action, sender) => {
    if (!token) return;

    try {
      const notification = notifications.find(n => n._id === notificationId);
      if (!notification) return;

      if (action === 'accept') {
        await api.post(
          `/api/user/accept-friend-request/${notificationId}`,
          {}
        );
        socket?.emit("notification:update", { notificationId, action: "accepted", to: sender?._id });
        await markNotificationAsRead(notificationId);
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        // Optionally, redirect to chat and open chat with new friend
        setTimeout(() => {
          navigate('/chat');
        }, 300); // Give time for UI update
      } else if (action === 'decline') {
        await api.post(
          `/api/user/decline-friend-request/${notificationId}`,
          {}
        );
        socket?.emit("notification:delete", { notificationId, to: sender?._id });
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
      }
    } catch (error) {
      console.error('Error handling friend request:', error);
    }
  };

  // Toggle notifications panel with animation
  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    // When opening notification panel, mark as "seen" (even if not read)
    if (!showNotifications) {
      setHasUnread(false);
    }
  };

  // Fetch notifications on mount
  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const handleNotificationAction = async (notificationId, action, sender) => {
    try {
      // Remove the notification from the list immediately for better UX
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      // Update unread count
      setHasUnread(prev => Math.max(0, prev - 1));
      
      // If it's accepting a friend request, refresh friends list
      if (action === 'accept') {
        // Add a small delay to ensure backend processing is complete
        setTimeout(() => {
          fetchFriends();
        }, 500);
      }
    } catch (error) {
      console.error('Error handling notification action:', error);
      // Reload notifications on error
      fetchNotifications();
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={toggleNotifications}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group"
        aria-label={`Notifications ${notifications.length > 0 ? `(${notifications.length})` : ''}`}
      >
        <svg
          className={`w-6 h-6 ${hasUnread ? 'text-primary-500' : 'text-gray-600 dark:text-gray-300'} 
            transition-all duration-300 
            ${isRinging ? 'animate-[bell-ring_0.5s_ease-in-out_infinite]' : ''} 
            group-hover:text-primary-600`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={hasUnread ? 2.5 : 2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {notifications.length > 0 && (
          <span className={`absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 rounded-full
            ${hasUnread ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}>
            {notifications.length}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 z-50"
            style={{ minWidth: "20rem" }}
          >
            <NotificationDropdown
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onClearAll={clearAllNotifications}
              onAction={handleFriendRequest}
              onClose={() => setShowNotifications(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
