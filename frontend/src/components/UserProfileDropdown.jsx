import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useFriends } from '../contexts/FriendContext';
import { AuthContext } from '../contexts/AuthContext';
import { SocketContext } from '../contexts/SocketContext'; // You need to create this context for global socket access

const UserProfileDropdown = ({
  user,
  anchorRef,
  onClose,
  isFriend,
  onFriendAdded
}) => {
  const { addFriend } = useFriends();
  const { user: currentUser } = useContext(AuthContext);
  const socket = useContext(SocketContext); // Use a global socket context
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const dropdownRef = useRef(null);

  // Position dropdown to the left of the avatar
  useEffect(() => {
    if (anchorRef?.current && dropdownRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      dropdownRef.current.style.position = 'absolute';
      dropdownRef.current.style.top = `${rect.bottom + window.scrollY + 8}px`;
      dropdownRef.current.style.left = `${rect.left + window.scrollX - 180}px`; // move left by 180px
      dropdownRef.current.style.zIndex = 1000;
    }
  }, [anchorRef]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorRef]);

  const handleAddFriend = async () => {
    setLoading(true);
    setActionMsg('');
    try {
      await addFriend(user._id);
      setActionMsg('Friend request sent!');
      // Emit socket event for real-time notification
      socket?.emit('notification:new', {
        type: 'friendRequest',
        sender: { _id: currentUser._id, username: currentUser.username },
        receiver: user._id,
        createdAt: new Date().toISOString(),
        read: false
      });
      onFriendAdded?.();
      onClose?.();
    } catch (e) {
      setActionMsg('Failed to send request');
    }
    setLoading(false);
  };

  const handleBlock = async () => {
    setLoading(true);
    setActionMsg('');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/block`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMsg('User blocked');
      if (socket) {
        socket.emit('friend:block', { to: user._id });
      }
      onBlocked?.();
    } catch {
      setActionMsg('Failed to block');
    }
    setLoading(false);
  };

  const handleReport = async () => {
    setLoading(true);
    setActionMsg('');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/report`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMsg('User reported');
      if (socket) {
        socket.emit('friend:report', { to: user._id });
      }
      onReported?.();
    } catch {
      setActionMsg('Failed to report');
    }
    setLoading(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 bg-white dark:bg-dark-800 rounded-xl shadow-xl p-4 w-64 right-0 top-14 border border-gray-200 dark:border-dark-700"
    >
      <div className="flex flex-col items-center">
        <img
          src={user.profileImage || `https://ui-avatars.com/api/?name=${user.username}`}
          alt={user.username}
          className="w-16 h-16 rounded-full mb-2"
        />
        <div className="font-bold text-lg">{user.username}</div>
        <div className="text-gray-500 text-sm mb-2">{user.email}</div>
        {user.bio && <div className="text-xs text-gray-400 mb-2">{user.bio}</div>}
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {!isFriend && (
          <button
            className="w-full px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded transition"
            onClick={handleAddFriend}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Add Friend'}
          </button>
        )}
        <button
          className="w-full py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
          onClick={handleBlock}
          disabled={loading}
        >
          Block
        </button>
        <button
          className="w-full py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
          onClick={handleReport}
          disabled={loading}
        >
          Report
        </button>
      </div>
      {actionMsg && <div className="mt-2 text-center text-xs text-primary-600">{actionMsg}</div>}
    </div>
  );
};

export default UserProfileDropdown;
