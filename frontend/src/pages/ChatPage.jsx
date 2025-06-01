import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';

const SOCKET_URL = import.meta.env.VITE_API_URL;
// Create an audio context for recording
const AudioContext = window.AudioContext || window.webkitAudioContext;

const ChatPage = () => {
  const { token, user } = useContext(AuthContext);
  const [peers, setPeers] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [processedMessages] = useState(new Set());
  const socketRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [peerSearch, setPeerSearch] = useState('');
  const fileInputRef = useRef(null);
  const [friends, setFriends] = useState([]);
  const [sidebarTab, setSidebarTab] = useState('peers'); // 'peers' or 'friends'

  // Voice message recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  
  // Notification sound
  const notificationSoundRef = useRef(new Audio('/notification.mp3'));
  const [notificationSettings, setNotificationSettings] = useState({
    messages: true,
    soundEnabled: true,
    messagePreview: true,
    showSender: true
  });

  // Get notification settings
  useEffect(() => {
    if (token) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/user/notification-settings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setNotificationSettings(res.data);
      })
      .catch(err => {
        console.error("Error fetching notification settings:", err);
      });
    }
  }, [token]);

  // Connect to socket.io
  useEffect(() => {
    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
    });
    
    setSocket(s);
    socketRef.current = s;
    
    s.emit('chat:join', user.id);
    
    s.on('connect', () => console.log('Socket connected'));
    s.on('connect_error', (err) => console.error('Socket connection error:', err));
    
    return () => {
      s.off('connect');
      s.off('connect_error');
      s.disconnect();
    };
  }, [token, user.id]);

  // Fetch peers - KEEP THIS ONE, REMOVE DUPLICATE BELOW
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/chat/peers`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setPeers(res.data));
  }, [token]);

  // Fetch unread counts for all peers - KEEP THIS ONE, REMOVE DUPLICATE BELOW
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/chat/unread-counts`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUnreadCounts(res.data));
  }, [token]);

  // Fetch friends
  useEffect(() => {
    if (token) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/user/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setFriends(res.data))
      .catch(() => setFriends([]));
    }
  }, [token]);

  // Fetch messages for selected peer
  useEffect(() => {
    if (!selectedPeer) return setMessages([]);
    axios.get(`${import.meta.env.VITE_API_URL}/api/chat/history/${selectedPeer._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMessages(res.data));
    
    if (selectedPeer) {
      axios.post(`${import.meta.env.VITE_API_URL}/api/chat/mark-read/${selectedPeer._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        setUnreadCounts((prev) => ({ ...prev, [selectedPeer._id]: 0 }));
      });
    }
  }, [selectedPeer, token]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show browser notification
  const showNotification = (msg, senderName) => {
    // Skip if this is our own message or notifications are disabled
    if (msg.from === user.id || !notificationSettings.messages) return;
    
    // Skip if we're already viewing this conversation
    if (selectedPeer && msg.from === selectedPeer._id) return;
    
    // Play notification sound if enabled
    if (notificationSettings.soundEnabled) {
      notificationSoundRef.current.play().catch(e => console.error("Error playing notification sound:", e));
    }
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      // Show "X sent you a message" instead of message content
      const title = `${senderName} sent you a message`;
      const body = notificationSettings.messagePreview ? 
        (msg.type === 'text' ? msg.content : 
         msg.type === 'image' ? 'Sent an image' : 
         msg.type === 'voice' ? 'Sent a voice message' : 'New message') : 
        'New message received';
        
      const notification = new Notification(title, {
        body,
        icon: '/chat-icon.svg'
      });
      
      // Focus app when notification clicked
      notification.onclick = () => window.focus();
    }
  };

  // --- Pin chat logic ---
  const [pinnedPeers, setPinnedPeers] = useState(() => {
    // Load from localStorage or default to []
    try {
      return JSON.parse(localStorage.getItem('pinnedPeers') || '[]');
    } catch { return []; }
  });

  const togglePinPeer = (peerId) => {
    setPinnedPeers(prev => {
      let updated;
      if (prev.includes(peerId)) {
        updated = prev.filter(id => id !== peerId);
      } else {
        updated = [...prev, peerId];
      }
      localStorage.setItem('pinnedPeers', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Timer for recording duration
      let seconds = 0;
      recordingTimerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
        // Limit recording to 60 seconds
        if (seconds >= 60) {
          stopRecording();
        }
      }, 1000);
      
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Could not access microphone");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      setRecordingTime(0);
    }
  };
  
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      setRecordingTime(0);
      setAudioBlob(null);
    }
  };
  
  const sendVoiceMessage = async () => {
    if (!audioBlob || !selectedPeer) return;
    
    // Create form data for audio upload
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice-message.webm');
    formData.append('to', selectedPeer._id);
    formData.append('type', 'voice');
    
    // Create temporary message for UI
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempMsg = {
      _id: messageId,
      from: user.id,
      to: selectedPeer._id,
      type: 'voice',
      content: URL.createObjectURL(audioBlob),
      createdAt: new Date().toISOString(),
      pending: true
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setAudioBlob(null);
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/voice-message`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update message with server response
      setMessages(prev => prev.map(m => 
        m._id === messageId ? { ...res.data, pending: false } : m
      ));
      
    } catch (err) {
      console.error('Error sending voice message:', err);
      setError('Failed to send voice message');
      setMessages(prev => prev.filter(m => m._id !== messageId));
    }
  };

  // Handle image upload
  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedPeer) return;
    
    // Validate file is an image and not too large
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image is too large (max 5MB)');
      return;
    }
    
    // Create form data for image upload
    const formData = new FormData();
    formData.append('image', file);
    formData.append('to', selectedPeer._id);
    formData.append('type', 'image');
    
    // Create temporary message with local image preview
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const imageSrc = URL.createObjectURL(file);
    const tempMsg = {
      _id: messageId,
      from: user.id,
      to: selectedPeer._id,
      type: 'image',
      content: imageSrc,
      createdAt: new Date().toISOString(),
      pending: true
    };
    
    setMessages(prev => [...prev, tempMsg]);
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/image-message`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update message with server response
      setMessages(prev => prev.map(m => 
        m._id === messageId ? { ...res.data, pending: false } : m
      ));
      
    } catch (err) {
      console.error('Error sending image:', err);
      setError('Failed to send image');
      setMessages(prev => prev.filter(m => m._id !== messageId));
    } finally {
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Send text message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedPeer) return;
    
    // Generate a truly unique message ID
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const tempMsg = {
      from: user.id,
      to: selectedPeer._id,
      type: 'text',
      content: msgInput,
      createdAt: new Date().toISOString(),
      _id: messageId,
      pending: true
    };
    
    // Add to UI immediately
    setMessages(prev => [...prev, tempMsg]);
    setMsgInput('');
    
    try {
      if (socketRef.current?.connected) {
        // Create a unique fingerprint for this message
        const fingerprint = `${user.id}-${selectedPeer._id}-${messageId}`;
        
        // Add to processed set to prevent duplicates
        processedMessages.add(fingerprint);
        
        // Emit via socket
        socketRef.current.emit('chat:message', {
          from: user.id,
          to: selectedPeer._id,
          content: tempMsg.content,
          type: 'text',
          clientId: messageId,
          fingerprint
        });
      } else {
        throw new Error('Socket disconnected');
      }
    } catch (err) {
      console.error('Message send error:', err);
      setError('Failed to send message. Please check your connection.');
      
      setMessages(prev => prev.filter(m => m._id !== messageId));
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    
    const messageHandler = (msg) => {
      // Create a fingerprint for deduplication
      const msgFingerprint = msg.fingerprint || 
                            `${msg.from}-${msg.to}-${msg._id || msg.clientId}`;
      
      // Skip if we've already processed this message
      if (processedMessages.has(msgFingerprint)) {
        return;
      }
      
      // Add to processed messages to prevent future duplicates
      processedMessages.add(msgFingerprint);
      
      // Find peer name for notification
      const senderPeer = peers.find(p => p._id === msg.from);
      const senderName = senderPeer?.username || 'Someone';
      
      // Show notification for new messages
      if (msg.from !== user.id) {
        showNotification(msg, senderName);
      }
      
      // Handle our own sent messages that got confirmation from server
      if (msg.clientId) {
        setMessages(prev => 
          prev.map(m => 
            m._id === msg.clientId 
              ? { ...msg, _id: msg._id || msg.clientId, pending: false }
              : m
          )
        );
        return;
      }
      
      // For messages in current chat
      if (selectedPeer &&
          ((msg.from === selectedPeer._id && msg.to === user.id) ||
           (msg.from === user.id && msg.to === selectedPeer._id))
      ) {
        // Check if this exact message already exists
        setMessages(prevMsgs => {
          if (prevMsgs.some(m => m._id === msg._id || 
                                (m.content === msg.content && 
                                 Math.abs(new Date(m.createdAt) - new Date(msg.createdAt)) < 1000))) {
            return prevMsgs; // Skip duplicate
          }
          return [...prevMsgs, { ...msg, pending: false }];
        });
      }
      
      // Update unread counts for messages not in current chat
      if (msg.to === user.id && (!selectedPeer || msg.from !== selectedPeer._id)) {
        setUnreadCounts(prev => {
          const prevCount = prev[msg.from] || 0;
          return { ...prev, [msg.from]: prevCount + 1 };
        });
      }
    };
    
    // Register handler and ensure cleanup
    socket.on('chat:message', messageHandler);
    return () => socket.off('chat:message', messageHandler);
  }, [socket, selectedPeer, user.id, processedMessages, peers]);

  // Close sidebar on peer select (mobile)
  const handlePeerSelect = (peer) => {
    setSelectedPeer(peer);
    setSidebarOpen(false);
    // Mark as read immediately on select
    setUnreadCounts((prev) => ({ ...prev, [peer._id]: 0 }));
  };

  // Filter peers by search and sort pinned first
  const filteredPeers = peers
    .filter(peer =>
      peer.username.toLowerCase().includes(peerSearch.toLowerCase())
    )
    .sort((a, b) => {
      const aPinned = pinnedPeers.includes(a._id);
      const bPinned = pinnedPeers.includes(b._id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });

  // Filter friends by search
  const filteredFriends = friends
    .filter(friend =>
      friend.username.toLowerCase().includes(peerSearch.toLowerCase())
    );

  // Helper to render user list (peers or friends)
  const renderUserList = useCallback((list, isPeerList) => (
    <ul>
      {list.length === 0 ? (
        <li className="text-dark-400 text-center py-4">No users found.</li>
      ) : (
        list.map(user => (
          <li
            key={user._id}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition
              ${selectedPeer?._id === user._id ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-dark-200 dark:hover:bg-dark-700'}
            `}
            onClick={() => handlePeerSelect(user)}
          >
            <img src={user.profileImage || `https://ui-avatars.com/api/?name=${user.username}`} alt="" className="w-9 h-9 rounded-full border-2 border-primary-200" />
            <span className="truncate flex-1 font-medium">{user.username}</span>
            {/* Pin/unpin button for peers only */}
            {isPeerList && (
              <button
                type="button"
                className={`ml-1 text-xs ${pinnedPeers.includes(user._id) ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-500`}
                onClick={e => { e.stopPropagation(); togglePinPeer(user._id); }}
                title={pinnedPeers.includes(user._id) ? 'Unpin chat' : 'Pin chat'}
              >
                {pinnedPeers.includes(user._id) ? '📌' : '📍'}
              </button>
            )}
            {/* Unread badge */}
            {unreadCounts[user._id] > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white min-w-[24px]">
                {unreadCounts[user._id] > 4 ? '4+' : unreadCounts[user._id]}
              </span>
            )}
          </li>
        ))
      )}
    </ul>
  ), [selectedPeer, pinnedPeers, unreadCounts, handlePeerSelect, togglePinPeer]);
  
  // Helper function to format recording time
  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render message content based on type
  const renderMessageContent = (msg) => {
    switch (msg.type) {
      case 'text':
        return <span>{msg.content}</span>;
      case 'image':
        return <img src={msg.content} alt="Sent image" className="max-w-full rounded-lg" />;
      case 'voice':
        return (
          <div className="w-[70vw] md:w-[30vw]">
            <audio 
              src={msg.content} 
              controls 
              className="w-full h-10 md:h-12" 
              controlsList="nodownload"
            />
          </div>
        );
      default:
        return <span>Unsupported message type</span>;
    }
  };

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [friendRequestLoading, setFriendRequestLoading] = useState(false);
  const popupRef = useRef(null);

  // Check if selected peer is already a friend
  useEffect(() => {
    if (selectedPeer && friends.length > 0) {
      const isFriend = friends.some(friend => friend._id === selectedPeer._id);
      setIsFriend(isFriend);
    }
  }, [selectedPeer, friends]);

  // Handle outside click to close profile popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    };

    if (showProfilePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfilePopup]);

  // Function to send friend request
  const sendFriendRequest = async () => {
    if (!selectedPeer || isFriend || friendRequestSent) return;
    
    setFriendRequestLoading(true);
    setError(''); // Clear previous errors
    
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-friend-request`,
        { toUserId: selectedPeer._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setFriendRequestSent(true);
      setFriendRequestLoading(false);
    } catch (err) {
      console.error('Error sending friend request:', err);
      // Display the error message from the backend
      setError(err?.response?.data?.error || 'Failed to send friend request');
      setFriendRequestLoading(false);
      // Reset UI state when error occurs
      setFriendRequestSent(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 pt-16">
      {/* Hidden file input for images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Sidebar - Full page on mobile */}
      <div className={`
        fixed z-30  left-0 w-full h-full md:h-auto md:top-16 md:bottom-0 md:w-72 bg-white/80 dark:bg-dark-800/90 backdrop-blur-lg shadow-xl p-0 overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0 md:w-1/4
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-100 dark:border-dark-700 bg-white/90 dark:bg-dark-900/80">
          <h3 className="font-bold text-xl tracking-wide">Chats</h3>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="text-2xl md:hidden p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-2">
          <button
            className={`flex-1 py-3 rounded-lg font-semibold transition ${sidebarTab === 'peers' ? 'bg-primary-500 text-white shadow' : 'bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-200'}`}
            onClick={() => setSidebarTab('peers')}
          >
            Peers
          </button>
          <button
            className={`flex-1 py-3 rounded-lg font-semibold transition ${sidebarTab === 'friends' ? 'bg-primary-500 text-white shadow' : 'bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-200'}`}
            onClick={() => setSidebarTab('friends')}
          >
            Friends
          </button>
        </div>

        {/* Search bar */}
        <div className="px-6 pb-2 pt-4">
          <div className="relative">
            <input
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder={`Search ${sidebarTab === 'peers' ? 'peers' : 'friends'}`}
              value={peerSearch}
              onChange={e => setPeerSearch(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* User list */}
        <div className="px-2 pb-4">
          {sidebarTab === 'peers'
            ? renderUserList(filteredPeers, true)
            : renderUserList(filteredFriends, false)}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col relative bg-white/80 dark:bg-dark-900/90 backdrop-blur-lg rounded-l-3xl shadow-lg mx-2 my-4 overflow-hidden">
        {/* Top bar */}
        <div className="p-4 border-b dark:border-dark-700 flex items-center bg-white/90 dark:bg-dark-900/80">
          <button
            className="md:hidden mr-4 text-2xl p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-full"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            {selectedPeer && (
              <img 
                src={selectedPeer.profileImage || `https://ui-avatars.com/api/?name=${selectedPeer.username}`} 
                alt="" 
                className="w-9 h-9 rounded-full border-2 border-primary-200 cursor-pointer hover:border-primary-400 transition-all"
                onClick={() => setShowProfilePopup(true)}
                title="View profile"
              />
            )}
            <h2 className="font-semibold text-lg">
              {selectedPeer ? selectedPeer.username : 'Select a user to chat'}
            </h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-8 py-4 space-y-3 bg-gradient-to-b from-white/60 dark:from-dark-900/80 to-white/90 dark:to-dark-800/90">
          {selectedPeer ? (
            messages.length === 0 ? (
              <div className="text-center text-dark-400 mt-10">No messages yet.</div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-xs sm:max-w-md md:max-w-lg break-words
                    px-4 py-3 rounded-2xl shadow-md
                    ${msg.from === user.id
                      ? 'bg-gradient-to-br from-primary-500 to-indigo-500 text-white rounded-tr-none'
                      : 'bg-dark-100 dark:bg-dark-700 text-dark-900 dark:text-white rounded-tl-none'}
                    border border-primary-100 dark:border-primary-900
                  `}>
                    {renderMessageContent(msg)}
                    <div className="text-xs text-right text-dark-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))
            )
          ) : (
            <div className="flex items-center justify-center h-full text-dark-400">Select a user to start chatting.</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedPeer && !isRecording && !audioBlob && (
          <form onSubmit={sendMessage} className="p-4 flex gap-2 border-t dark:border-dark-700 bg-white/90 dark:bg-dark-900/80">
            <input
              className="w-[40vw] md:flex-1 px-4 py-3 rounded-full border dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 shadow"
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              placeholder="Type a message..."
              autoFocus
            />

            {/* Image upload button */}
            <motion.button
              type="button"
              onClick={handleImageSelect}
              className="p-2 rounded-full bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 shadow"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              title="Send image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </motion.button>

            {/* Voice recording button */}
            <motion.button
              type="button"
              onClick={startRecording}
              className="p-2 rounded-full bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 shadow"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              title="Send voice message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </motion.button>

            {/* Send button */}
            <motion.button
              type="submit"
              className="px-6 py-2 bg-primary-500 text-white rounded-full font-semibold shadow hover:bg-primary-600 transition"
              disabled={!msgInput.trim()}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Send
            </motion.button>
          </form>
        )}

        {/* Recording UI */}
        {selectedPeer && isRecording && (
          <div className="p-4 flex flex-col sm:flex-row gap-2 border-t dark:border-dark-700 bg-white/90 dark:bg-dark-900/80">
            <div className="flex-1 flex items-center">
              <div className="animate-pulse mr-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <span className="font-medium">Recording: {formatTime(recordingTime)}</span>
            </div>

            <div className="flex gap-2 justify-end mt-2 sm:mt-0">
              <motion.button
                type="button"
                onClick={cancelRecording}
                className="p-2 rounded-full bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 shadow flex-1 sm:flex-none"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>

              <motion.button
                type="button"
                onClick={stopRecording}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow flex-1 sm:flex-none"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Stop
              </motion.button>
            </div>
          </div>
        )}

        {/* Audio Review UI */}
        {selectedPeer && audioBlob && !isRecording && (
          <div className="p-4 flex flex-col sm:flex-row gap-2 border-t dark:border-dark-700 bg-white/90 dark:bg-dark-900/80">
            <div className="w-[70vw] md:w-full flex-1">
              <audio 
                src={URL.createObjectURL(audioBlob)} 
                controls 
                className="w-full h-10 md:h-16" 
                controlsList="nodownload"
              />
            </div>

            <div className="flex gap-2 justify-end mt-2 sm:mt-0">
              <motion.button
                type="button"
                onClick={() => setAudioBlob(null)}
                className="p-2 rounded-full bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 shadow flex-1 sm:flex-none"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>

              <motion.button
                type="button"
                onClick={sendVoiceMessage}
                className="px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition shadow flex-1 sm:flex-none"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Send
              </motion.button>
            </div>
          </div>
        )}

        {/* Profile Popup */}
        {showProfilePopup && selectedPeer && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <motion.div
              ref={popupRef}
              className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full m-4 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="flex flex-col items-center mb-4">
                <img 
                  src={selectedPeer.profileImage || `https://ui-avatars.com/api/?name=${selectedPeer.username}&size=150`}
                  alt={selectedPeer.username}
                  className="w-32 h-32 rounded-full border-4 border-primary-200"
                />
                <h3 className="text-xl font-bold mt-4">{selectedPeer.username}</h3>
                
                {/* Bio display with improved styling */}
                <div className="w-full mt-3 text-center">
                  <p className="text-sm font-medium text-dark-500 dark:text-dark-300 mb-1">Bio</p>
                  <div className="bg-dark-100/50 dark:bg-dark-700/50 p-3 rounded-lg">
                    <p className="text-dark-600 dark:text-dark-300 italic">
                      {selectedPeer.bio ? selectedPeer.bio : 'No bio provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-dark-200 dark:border-dark-700 pt-4">
                {selectedPeer.email && (
                  <div className="flex items-center mb-2">
                    <span className="text-dark-500 dark:text-dark-400 w-24">Email:</span>
                    <span>{selectedPeer.email}</span>
                  </div>
                )}
                {/* Other profile details can be added here */}
              </div>

              {/* Add error message display */}
              {error && (
                <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                {!isFriend && (
                  <button
                    className={`
                      px-4 py-2 rounded-lg transition
                      ${friendRequestSent
                        ? 'bg-green-500 text-white'
                        : 'bg-primary-500 hover:bg-primary-600 text-white'
                      }
                      ${friendRequestLoading ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                    onClick={sendFriendRequest}
                    disabled={friendRequestSent || friendRequestLoading}
                  >
                    {friendRequestLoading ? 'Sending...' : friendRequestSent ? 'Request Sent' : 'Add Friend'}
                  </button>
                )}
                <button
                  className="px-4 py-2 bg-dark-200 dark:bg-dark-600 hover:bg-dark-300 dark:hover:bg-dark-500 rounded-lg transition"
                  onClick={() => setShowProfilePopup(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Error display */}
        {error && <div className="text-red-500 p-2">{error}</div>}
      </div>
    </div>
  );
};

export default ChatPage;
