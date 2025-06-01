import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const FriendContext = createContext();

export const useFriends = () => {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error('useFriends must be used within a FriendProvider');
  }
  return context;
};

export const FriendProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useContext(AuthContext);
  const socketRef = useRef(null);

  // Fetch friends list
  const fetchFriends = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/friends`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch friends');
      console.error('Error fetching friends:', err);
    } finally {
      setLoading(false);
    }
  };

  // Set up WebSocket connection for real-time friend updates
  useEffect(() => {
    if (token && user) {
      const connectWebSocket = () => {
        try {
          let apiUrl = import.meta.env.VITE_API_URL;
          let wsUrl;

          try {
            const url = new URL(apiUrl);
            const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
            wsUrl = `${wsProtocol}//${url.host}/ws/friends`;
          } catch (e) {
            console.warn('Could not parse API URL, using fallback method', e);
            wsUrl = apiUrl.replace(/^http:\/\//i, 'ws://').replace(/^https:\/\//i, 'wss://') + '/ws/friends';
          }

          socketRef.current = new WebSocket(`${wsUrl}?token=${token}`);

          socketRef.current.addEventListener('open', () => {
            console.log('WebSocket connected for friend updates');
          });

          socketRef.current.addEventListener('message', (event) => {
            try {
              const data = JSON.parse(event.data);
              
              switch (data.type) {
                case 'friend_added':
                  setFriends(prev => [...prev, data.friend]);
                  break;
                case 'friend_removed':
                  setFriends(prev => prev.filter(f => f._id !== data.friendId));
                  break;
                case 'friend_updated':
                  setFriends(prev => prev.map(f => 
                    f._id === data.friend._id ? { ...f, ...data.friend } : f
                  ));
                  break;
                case 'friends_sync':
                  setFriends(data.friends);
                  break;
                default:
                  console.warn('Unknown friend update type:', data.type);
              }
            } catch (err) {
              console.error('Error processing friend update:', err);
            }
          });

          socketRef.current.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
          });

          socketRef.current.addEventListener('close', () => {
            console.log('WebSocket connection closed');
            // Attempt to reconnect after a delay
            setTimeout(connectWebSocket, 3000);
          });
        } catch (error) {
          console.error('Error setting up WebSocket:', error);
        }
      };

      connectWebSocket();

      // Initial fetch of friends
      fetchFriends();

      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [token, user]);

  // Friend management functions
  const addFriend = async (friendId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/friends/${friendId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to add friend');
      throw err;
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/friends/${friendId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends(prev => prev.filter(f => f._id !== friendId));
    } catch (err) {
      setError('Failed to remove friend');
      throw err;
    }
  };

  const value = {
    friends,
    loading,
    error,
    addFriend,
    removeFriend,
    fetchFriends
  };

  return (
    <FriendContext.Provider value={value}>
      {children}
    </FriendContext.Provider>
  );
};

export default FriendContext; 