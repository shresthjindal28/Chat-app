import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { io } from 'socket.io-client';

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

  // Fetch friends list
  const fetchFriends = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/friends`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 45000 }
      );
      setFriends(response.data);
      setError(null);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError(
          'Request timed out. The backend server may be waking up or is slow to respond. ' +
          'Please wait a few seconds and try again. ' +
          'Backend URL: ' + import.meta.env.VITE_API_URL
        );
      } else {
        setError('Failed to fetch friends');
      }
      console.error('Error fetching friends:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFriends();
  }, [token]);

  // Socket.IO for real-time updates
  useEffect(() => {
    if (!token) return;
    
    try {
      const socket = io(import.meta.env.VITE_API_URL, {
        auth: { token },
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      
      socket.on('connect', () => {
        console.log('Socket.IO connected for friend updates');
      });
      
      socket.on('friend:update', (data) => {
        console.log('Friend update received:', data);
        
        if (data.type === 'added' || data.type === 'accepted') {
          setFriends(prevFriends => {
            if (!prevFriends.some(f => f._id === data.friend._id)) {
              return [...prevFriends, data.friend];
            }
            return prevFriends;
          });
        } else if (data.type === 'removed') {
          setFriends(prevFriends => 
            prevFriends.filter(f => f._id !== data.friendId)
          );
        }
        
        // Refresh the full friends list to ensure consistency
        setTimeout(() => {
          fetchFriends();
        }, 1000);
      });
      
      socket.on('friend:request', (data) => {
        console.log('New friend request received:', data);
        // Could trigger a notification update here
      });
      
      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.error('Error creating Socket.IO connection:', err);
    }
  }, [token]);

  const value = {
    friends,
    loading,
    error,
    fetchFriends
  };

  return (
    <FriendContext.Provider value={value}>
      {children}
    </FriendContext.Provider>
  );
};

export default FriendContext;