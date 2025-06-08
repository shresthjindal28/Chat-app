import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const NotificationItem = ({ notification, onAction, onMarkAsRead }) => {
  const { sender, type, createdAt, read } = notification;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleClick = () => {
    if (!read) onMarkAsRead(notification._id);
    if (type === 'message' || type === 'friendAccepted') navigate('/chat');
  };

  const handleFriendRequestAction = async (action) => {
    if (!token) {
      console.error('No authentication token available');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = action === 'accept' 
        ? `/api/user/accept-friend-request/${notification._id}`
        : `/api/user/decline-friend-request/${notification._id}`;
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log(`Friend request ${action}ed successfully:`, response.data);

      // Call the parent's onAction to update the notification list
      if (onAction) {
        onAction(notification._id, action, sender);
      }
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
      
      if (error.response?.status === 401) {
        console.error('Authentication failed. Please log in again.');
        // Could redirect to login or show auth error
      } else {
        console.error('Failed to process friend request:', error.response?.data?.error || error.message);
      }
    } finally {
      setIsLoading(false);
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

  // Always show sender username with reliable fallbacks
  const senderName = notification.sender?.username || 
                     notification.senderName || 
                     'Unknown User';

  return (
    <div
      onClick={type !== 'friendRequest' ? handleClick : undefined}
      className={`p-4 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${
        !read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      } ${type !== 'friendRequest' ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start gap-3">
        <UserAvatar user={sender} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 dark:text-white">{senderName}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(createdAt)}</span>
          </div>
          {type === 'friendRequest' ? (
            <>
              <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                <b>{senderName}</b> sent you a friend request.
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFriendRequestAction('accept');
                  }}
                  disabled={isLoading}
                  className={`px-4 py-1 rounded text-xs font-semibold transition ${
                    isLoading 
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Accept'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFriendRequestAction('decline');
                  }}
                  disabled={isLoading}
                  className={`px-4 py-1 rounded text-xs font-semibold transition ${
                    isLoading 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Decline'}
                </button>
              </div>
            </>
          ) : type === 'friendAccepted' ? (
            <div className="mt-1 text-sm text-green-700 dark:text-green-400">
              <b>{senderName}</b> accepted your friend request.
            </div>
          ) : (
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {notification.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
