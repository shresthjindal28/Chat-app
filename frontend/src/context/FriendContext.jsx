import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/axiosConfig';

const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);

  const fetchFriends = async () => {
    try {
      const response = await api.get('/api/user/friends');
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <FriendContext.Provider value={{ friends }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriends = () => {
  return useContext(FriendContext);
};