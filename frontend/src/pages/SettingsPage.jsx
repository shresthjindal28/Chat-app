import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { token, user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState({
    messages: true,
    email: false,
    desktop: true,
    soundEnabled: true,
    messagePreview: true,
    showSender: true
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Manage friends state ---
  const [friends, setFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendsError, setFriendsError] = useState('');
  
  // --- Notifications state ---
  const [userNotifications, setUserNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');
  const [notificationActionInProgress, setNotificationActionInProgress] = useState(null);

  // Fetch user notification settings on load
  useEffect(() => {
    if (token) {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL}/api/user/notification-settings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setNotifications(prev => ({
          ...prev,
          ...res.data
        }));
        setLoading(false);
      })
      .catch(() => {
        console.error("Error fetching notification settings");
        setLoading(false);
      });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      setFriendsLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL}/api/user/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setFriends(res.data))
      .catch(() => setFriendsError('Failed to load friends'))
      .finally(() => setFriendsLoading(false));
    }
  }, [token]);

  // Fetch user notifications
  useEffect(() => {
    if (token) {
      setNotificationsLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL}/api/user/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUserNotifications(res.data))
      .catch(err => {
        console.error("Error fetching notifications:", err);
        setNotificationsError('Failed to load notifications');
      })
      .finally(() => setNotificationsLoading(false));
    }
  }, [token]);

  const handleNotificationChange = (type) => {
    const updatedSettings = {
      ...notifications,
      [type]: !notifications[type]
    };
    
    setNotifications(updatedSettings);
    
    // Save changes to API
    if (token) {
      axios.post(`${import.meta.env.VITE_API_URL}/api/user/notification-settings`, 
        { [type]: updatedSettings[type] },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setSuccess('Settings updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(() => {
        setError('Failed to update settings');
        setTimeout(() => setError(''), 3000);
      });
    }
  };

  const removeFriend = (friendId) => {
    if (!window.confirm('Remove this friend?')) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/user/remove-friend`, { friendId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => setFriends(friends => friends.filter(f => f._id !== friendId)))
    .catch(() => setFriendsError('Failed to remove friend'));
  };

  // Test notifications
  const testNotification = () => {
    if (!('Notification' in window)) {
      setError('Your browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Chat Notification Test', {
        body: 'This is how your notifications will look',
        icon: '/chat-icon.svg'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Chat Notification Test', {
            body: 'This is how your notifications will look',
            icon: '/chat-icon.svg'
          });
        }
      });
    }
  };

  // Handle friend request actions (accept/decline)
  const handleFriendRequest = async (notificationId, action) => {
    if (!token) return;
    
    setNotificationActionInProgress(notificationId);
    setError('');
    setSuccess('');
    
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/notification-action`,
        { notificationId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Show success message
      setSuccess(action === 'accept' ? 'Friend request accepted!' : 'Friend request declined');
      
      // Update notifications list - remove the processed notification
      setUserNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      // If accepted, update friends list
      if (action === 'accept') {
        // Refetch friends to get the updated list
        axios.get(`${import.meta.env.VITE_API_URL}/api/user/friends`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setFriends(res.data))
        .catch(err => console.error("Error refreshing friends list:", err));
      }
      
    } catch (err) {
      console.error(`Error ${action === 'accept' ? 'accepting' : 'declining'} friend request:`, err);
      setError(err?.response?.data?.error || `Failed to ${action} friend request`);
    } finally {
      setNotificationActionInProgress(null);
      
      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 pt-20">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 border-b pb-3">Settings</h2>
        
        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {/* Appearance Section */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Appearance</h3>
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <div>
              <h4 className="font-medium">Theme</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Toggle between light and dark mode</p>
            </div>
            <button 
              onClick={toggleDarkMode} 
              className="px-4 py-2 rounded bg-primary-500 hover:bg-primary-600 text-white transition"
            >
              {darkMode ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </section>
        
        {/* Notifications Section */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Notifications</h3>
          
          <div className="space-y-4">
            {/* Original notification settings */}
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <div>
                <h4 className="font-medium">Message Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get notified when you receive a new message</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.messages} 
                  onChange={() => handleNotificationChange('messages')} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Receive email notifications for important updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.email} 
                  onChange={() => handleNotificationChange('email')} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <div>
                <h4 className="font-medium">Desktop Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Show desktop notifications when you have the app minimized</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.desktop} 
                  onChange={() => handleNotificationChange('desktop')} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-500"></div>
              </label>
            </div>

            {/* New chat-specific notification settings */}
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <div>
                <h4 className="font-medium">Notification Sound</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Play a sound when new messages arrive</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.soundEnabled} 
                  onChange={() => handleNotificationChange('soundEnabled')} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <div>
                <h4 className="font-medium">Message Preview</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Show message content in notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.messagePreview} 
                  onChange={() => handleNotificationChange('messagePreview')} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <div>
                <h4 className="font-medium">Show Sender Name</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Include sender name in notification</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.showSender} 
                  onChange={() => handleNotificationChange('showSender')} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <div>
                <h4 className="font-medium">Test Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Send yourself a test notification</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition"
                onClick={testNotification}
              >
                Test
              </motion.button>
            </div>
          </div>
        </section>
        
        {/* Account Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Account</h3>
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <div>
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Permanently delete your account and all associated data</p>
            </div>
            <button className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition cursor-not-allowed opacity-70" disabled>
              Delete Account (Coming Soon)
            </button>
          </div>
        </section>

        {/* Friend Requests Section - New! */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Friend Requests</h3>
          {notificationsLoading ? (
            <div className="text-gray-500">Loading notifications...</div>
          ) : notificationsError ? (
            <div className="text-red-500">{notificationsError}</div>
          ) : (
            <>
              {userNotifications.filter(notif => notif.type === 'friendRequest' && !notif.read).length === 0 ? (
                <div className="text-gray-500">No pending friend requests.</div>
              ) : (
                <ul className="space-y-3">
                  {userNotifications
                    .filter(notif => notif.type === 'friendRequest' && !notif.read)
                    .map(notif => (
                      <li key={notif._id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <div>
                          <p className="font-medium">{notif.senderName || 'Someone'} sent you a friend request</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
                            onClick={() => handleFriendRequest(notif._id, 'accept')}
                            disabled={notificationActionInProgress === notif._id}
                          >
                            {notificationActionInProgress === notif._id ? '...' : 'Accept'}
                          </button>
                          <button
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-dark-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                            onClick={() => handleFriendRequest(notif._id, 'decline')}
                            disabled={notificationActionInProgress === notif._id}
                          >
                            {notificationActionInProgress === notif._id ? '...' : 'Decline'}
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
              
              {userNotifications.filter(notif => notif.type === 'friendAccepted' && !notif.read).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Accepted Friend Requests</h4>
                  <ul className="space-y-3">
                    {userNotifications
                      .filter(notif => notif.type === 'friendAccepted' && !notif.read)
                      .map(notif => (
                        <li key={notif._id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                          <p>{notif.senderName || 'Someone'} accepted your friend request</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </section>

        {/* Manage Friends Section */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Manage Friends</h3>
          {friendsLoading ? (
            <div className="text-gray-500">Loading friends...</div>
          ) : friendsError ? (
            <div className="text-red-500">{friendsError}</div>
          ) : friends.length === 0 ? (
            <div className="text-gray-500">You have no friends yet.</div>
          ) : (
            <ul className="space-y-2">
              {friends.map(friend => (
                <li key={friend._id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <img src={friend.profileImage || `https://ui-avatars.com/api/?name=${friend.username}`} alt="" className="w-8 h-8 rounded-full" />
                    <span>{friend.username}</span>
                  </div>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    onClick={() => removeFriend(friend._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
