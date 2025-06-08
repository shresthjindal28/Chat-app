import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import UserProfileDropdown from '../components/UserProfileDropdown';
import { useFriends } from '../contexts/FriendContext';
import { motion } from "framer-motion";

const SOCKET_URL = import.meta.env.VITE_API_URL;

const ChatPage = () => {
  const { token, user } = useContext(AuthContext);
  const { friends, fetchFriends } = useFriends();
  const [peers, setPeers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [peersLoading, setPeersLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'all-users'
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastReadTimestamps, setLastReadTimestamps] = useState({}); // For read receipts
  const [peerSearch, setPeerSearch] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const avatarRef = useRef(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [friendRequestLoading, setFriendRequestLoading] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch peers
  useEffect(() => {
    if (!token) return;
    
    setPeersLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/chat/peers`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 45000 // Increase timeout for cold start
      })
      .then((res) => {
        console.log('Peers loaded:', res.data);
        setPeers(res.data);
        setError('');
      })
      .catch((err) => {
        console.error('Error loading peers:', err);
        if (err.code === 'ECONNABORTED') {
          setError(
            'Request timed out. The backend server may be waking up or is slow to respond. ' +
            'Please wait a few seconds and try again. ' +
            'Backend URL: ' + import.meta.env.VITE_API_URL
          );
        } else if (err.code === 'ERR_NETWORK') {
          setError('Cannot connect to server. Please check if the backend is running at ' + import.meta.env.VITE_API_URL);
        } else {
          setError('Failed to load chat users');
        }
      })
      .finally(() => {
        setPeersLoading(false);
      });
  }, [token]);

  // Use friends as peers if peers are empty
  useEffect(() => {
    if (friends && friends.length > 0 && peers.length === 0 && !peersLoading) {
      console.log('Using friends as peers:', friends);
      setPeers(friends);
    }
  }, [friends, peers.length, peersLoading]);

  // Fetch messages for selected peer
  useEffect(() => {
    if (!selectedPeer) return setMessages([]);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/chat/history/${selectedPeer._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 45000
      })
      .then((res) => setMessages(res.data))
      .catch((err) => {
        if (err.code === 'ECONNABORTED') {
          setError(
            'Request timed out. The backend server may be waking up or is slow to respond. ' +
            'Please wait a few seconds and try again. ' +
            'Backend URL: ' + import.meta.env.VITE_API_URL
          );
        }
      });
  }, [selectedPeer, token]);

  // Fetch unread counts for all friends on mount and when messages change
  useEffect(() => {
    if (!token) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/chat/unread-counts`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 45000
    })
    .then(res => setUnreadCounts(res.data))
    .catch((err) => {
      if (err.code === 'ECONNABORTED') {
        setError(
          'Request timed out. The backend server may be waking up or is slow to respond. ' +
          'Please wait a few seconds and try again. ' +
          'Backend URL: ' + import.meta.env.VITE_API_URL
        );
      }
    });
  }, [token]);

  // Mark messages as read when opening a chat
  useEffect(() => {
    if (!selectedPeer || !token) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/chat/mark-read/${selectedPeer._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 45000
    }).then(() => {
      setUnreadCounts(prev => ({ ...prev, [selectedPeer._id]: 0 }));
      // Optionally update lastReadTimestamps for read receipts
      setLastReadTimestamps(prev => ({
        ...prev,
        [selectedPeer._id]: Date.now()
      }));
      // Emit socket event for read receipt
      socketRef.current?.emit('chat:read', { peerId: selectedPeer._id });
    }).catch((err) => {
      if (err.code === 'ECONNABORTED') {
        setError(
          'Request timed out. The backend server may be waking up or is slow to respond. ' +
          'Please wait a few seconds and try again. ' +
          'Backend URL: ' + import.meta.env.VITE_API_URL
        );
      }
    });
  }, [selectedPeer, token]);

  // Socket setup
  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;
    socket.emit("chat:join", user.id);

    socket.on("chat:message", (msg) => {
      // Only add the message to our state if it wasn't sent by us
      // Messages we send are already added to state in the sendMessage function
      if (msg.from !== user.id) {
        setMessages((prev) => [...prev, msg]);
        // Update unread counts if not in current chat
        if (!selectedPeer || msg.from !== selectedPeer._id) {
          setUnreadCounts((prev) => ({
            ...prev,
            [msg.from]: (prev[msg.from] || 0) + 1,
          }));
        }
      }
    });

    // Listen for delivery and read receipts
    socket.on("chat:delivered", ({ messageId }) => {
      setMessages(prev =>
        prev.map(m => m._id === messageId ? { ...m, status: "delivered" } : m)
      );
    });
    socket.on("chat:read", ({ peerId, timestamp }) => {
      // Mark all messages from/to peer as read
      setMessages(prev =>
        prev.map(m =>
          (m.to === peerId || m.from === peerId)
            ? { ...m, status: "read" }
            : m
        )
      );
      setLastReadTimestamps(prev => ({
        ...prev,
        [peerId]: timestamp || Date.now()
      }));
    });

    return () => socket.disconnect();
  }, [token, user.id, selectedPeer]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send text message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedPeer) return;
    const tempId = Math.random().toString(36).slice(2);
    const msg = {
      _id: tempId, // temp id for UI
      from: user.id,
      to: selectedPeer._id,
      type: "text",
      content: msgInput,
      createdAt: new Date().toISOString(),
      status: "sent"
    };
    setMessages((prev) => [...prev, msg]);
    setMsgInput("");
    socketRef.current?.emit("chat:message", msg, (serverMsg) => {
      // Callback: update with real id and status
      setMessages(prev =>
        prev.map(m =>
          m._id === tempId
            ? { ...serverMsg, status: "delivered" }
            : m
        )
      );
    });
  };

  // Image upload
  const handleImageSelect = () => fileInputRef.current?.click();
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedPeer) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image is too large (max 5MB)");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    formData.append("to", selectedPeer._id);
    formData.append("type", "image");
    
    // Add message with temporary local URL for immediate display
    const tempImageUrl = URL.createObjectURL(file);
    const tempMsg = {
      from: user.id,
      to: selectedPeer._id,
      type: "image",
      content: tempImageUrl,
      createdAt: new Date().toISOString(),
      pending: true, // Flag to indicate this is a temporary message
    };
    setMessages(prev => [...prev, tempMsg]);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/image-message`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 45000
        }
      );
      
      // Replace temporary message with actual one from server
      if (response.data && response.data.message) {
        setMessages(prev => 
          prev.map(msg => 
            (msg === tempMsg ? response.data.message : msg)
          )
        );
        
        // Socket already handles real-time updates for the receiver side
        // The backend should emit a socket event upon image upload
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError(
          'Request timed out. The backend server may be waking up or is slow to respond. ' +
          'Please wait a few seconds and try again. ' +
          'Backend URL: ' + import.meta.env.VITE_API_URL
        );
      } else {
        setError("Failed to send image");
      }
      // Remove the temporary message on error
      setMessages(prev => prev.filter(msg => msg !== tempMsg));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Voice recording
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

      mediaRecorder.onstop = handleStopRecording;
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer for recording duration
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } catch {
      setError("Microphone access denied. Please allow microphone access to send voice messages.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(recordingTimerRef.current);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleStopRecording = async () => {
    if (!selectedPeer) return;
    
    let tempMsg = null;
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      
      // Don't send very short recordings (less than 0.5 seconds)
      if (audioBlob.size < 1000) {
        setIsRecording(false);
        return;
      }
      
      // Create temporary URL for immediate display
      const tempAudioUrl = URL.createObjectURL(audioBlob);
      tempMsg = {
        from: user.id,
        to: selectedPeer._id,
        type: "voice",
        content: tempAudioUrl,
        createdAt: new Date().toISOString(),
        pending: true, // Flag to indicate this is a temporary message
      };
      setMessages(prev => [...prev, tempMsg]);

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("to", selectedPeer._id);
      formData.append("type", "voice");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/voice-message`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 45000
        }
      );
      
      // Replace temporary message with actual one from server
      if (response.data && response.data.message) {
        setMessages(prev => 
          prev.map(msg => 
            (msg === tempMsg ? response.data.message : msg)
          )
        );
        
        // Socket already handles real-time updates for the receiver side
        // The backend should emit a socket event upon voice upload
      }
    } catch  {
      setError("Failed to send voice message");
      // Remove the temporary message on error
      if (tempMsg) {
        setMessages(prev => prev.filter(msg => msg !== tempMsg));
      }
    } finally {
      setIsRecording(false);
    }
  };

  // Format seconds to MM:SS display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Get the appropriate user list based on active tab
  const getCurrentUserList = () => {
    return activeTab === 'friends' ? peers : allUsers;
  };

  // Check if a user is already a friend
  const isUserFriend = (userId) => {
    return friends.some(f => f._id === userId);
  };

  // Send friend request with better error handling
  const handleSendFriendRequest = async (userId, username) => {
    setFriendRequestLoading(prev => ({ ...prev, [userId]: true }));
    setError('');
    setSuccessMessage('');
    
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-friend-request`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 45000 }
      );
      
      setSuccessMessage(`Friend request sent to ${username}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh friends list to update any changes
      fetchFriends();
      
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError(
          'Request timed out. The backend server may be waking up or is slow to respond. ' +
          'Please wait a few seconds and try again. ' +
          'Backend URL: ' + import.meta.env.VITE_API_URL
        );
      } else {
        const errorMsg = err.response?.data?.error || 'Failed to send friend request';
        setError(errorMsg);
      }
      setTimeout(() => setError(''), 5000);
    } finally {
      setFriendRequestLoading(prev => ({ ...prev, [userId]: false }));
    }
  };


  // Sidebar user list
  const currentUserList = getCurrentUserList();
  const filteredUsers = currentUserList.filter((userItem) =>
    userItem.username.toLowerCase().includes(peerSearch.toLowerCase())
  );

  const ImageMessage = ({ src, isOwn, pending }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    return (
      <div className="relative flex justify-center items-center min-h-[120px] max-w-xs sm:max-w-md mx-auto">
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/60 dark:bg-dark-900/60 rounded-lg">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        )}
        {error ? (
          <div className="flex flex-col items-center justify-center w-full h-full py-8">
            <span className="text-red-500 text-sm">Failed to load image</span>
          </div>
        ) : (
          <motion.img
            src={src}
            alt="Image message"
            className={`max-w-full max-h-[300px] rounded-lg shadow-md object-contain ${isOwn ? "ml-auto" : "mr-auto"} ${pending ? "opacity-70" : ""}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: pending ? 0.7 : 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}
        {pending && (
          <div className="absolute bottom-2 right-2 text-xs text-white bg-gray-700 px-2 py-1 rounded-full">
            Sending...
          </div>
        )}
      </div>
    );
  };

  const VoiceMessage = ({ src, pending }) => {
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [current, setCurrent] = useState(0);
    const [error, setError] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
      setError(false);
      setCurrent(0);
      setPlaying(false);
      if (audioRef.current && audioRef.current.readyState >= 1) {
        setDuration(audioRef.current.duration);
      }
    }, [src]);

    const format = (s) => {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m < 10 ? "0" : ""}${m}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
      <div className="w-full max-w-xs sm:max-w-sm mx-auto relative">
        <audio
          ref={audioRef}
          src={src}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
          onTimeUpdate={() => setCurrent(audioRef.current.currentTime)}
          onEnded={() => setPlaying(false)}
          onError={() => setError(true)}
          className="hidden"
        />
        <div className={`flex items-center gap-2 rounded-full px-3 py-2 bg-gray-100 dark:bg-gray-700 ${pending ? "opacity-70" : ""}`}>
          <button
            onClick={() => {
              if (!audioRef.current) return;
              if (audioRef.current.paused) {
                audioRef.current.play();
                setPlaying(true);
              } else {
                audioRef.current.pause();
                setPlaying(false);
              }
            }}
            aria-label={playing ? "Pause voice message" : "Play voice message"}
            className={`w-8 h-8 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 ${
              playing ? "bg-red-500 text-white" : "bg-primary-500 text-white"
            }`}
            disabled={error}
          >
            {playing ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500"
                style={{ width: duration ? `${(current / duration) * 100}%` : "0%" }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
              <span>{format(current)}</span>
              <span>{format(duration || 0)}</span>
            </div>
          </div>
        </div>
        {error && (
          <div className="text-xs text-red-500 mt-1 text-center">Failed to load audio</div>
        )}
        {pending && (
          <div className="absolute bottom-[-6px] right-2 text-xs text-white bg-gray-700 px-2 py-1 rounded-full">
            Sending...
          </div>
        )}
      </div>
    );
  };

  // Helper to render ticks for message status
  function renderTicks(status) {
    // 1 gray tick for sent, 2 gray for delivered, 2 green for read
    if (status === "sent") {
      return (
        <span className="ml-2 flex items-center">
          <svg width="16" height="16" className="inline">
            <polyline
              points="2,9 6,13 14,5"
              fill="none"
              stroke="#aaa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );
    }
    if (status === "delivered") {
      return (
        <span className="ml-2 flex items-center">
          <svg width="16" height="16" className="inline" style={{ marginRight: -4 }}>
            <polyline
              points="2,9 6,13 14,5"
              fill="none"
              stroke="#aaa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg width="16" height="16" className="inline">
            <polyline
              points="2,9 6,13 14,5"
              fill="none"
              stroke="#aaa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );
    }
    if (status === "read") {
      return (
        <span className="ml-2 flex items-center">
          <svg width="16" height="16" className="inline" style={{ marginRight: -4 }}>
            <polyline
              points="2,9 6,13 14,5"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg width="16" height="16" className="inline">
            <polyline
              points="2,9 6,13 14,5"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );
    }
    return null;
  }

  // MessagePlayer component with read receipt ticks
  const MessagePlayer = ({ message, isOwn }) => {
    if (!message) return null;
    // Show ticks for own text/image/voice messages
    const showTicks = isOwn && (message.type === "text" || message.type === "image" || message.type === "voice");
    return (
      <span className="break-words whitespace-pre-line text-base leading-relaxed flex items-end gap-1">
        {/* ...existing code for content... */}
        {message.type === "image" ? (
          <ImageMessage src={message.content} isOwn={isOwn} pending={message.pending} />
        ) : message.type === "voice" ? (
          <VoiceMessage src={message.content} pending={message.pending} />
        ) : (
          message.content
        )}
        {message.pending && (
          <span className="inline-block ml-2 text-xs text-gray-500">
            Sending...
          </span>
        )}
        {showTicks && !message.pending && renderTicks(message.status)}
      </span>
    );
  };

  // Helper to check if selectedPeer is already a friend
  const isSelectedPeerFriend = selectedPeer && friends.some(f => f._id === selectedPeer._id);

  // Real-time friend updates
  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;

    socket.on('friend:update', () => {
      fetchFriends();
    });

    socket.on('friend:request', () => {
      fetchFriends();
    });

    return () => {
      socket.off('friend:update');
      socket.off('friend:request');
    };
  }, [fetchFriends]);

  // Only allow sending messages if both are friends
  const canSendMessage = selectedPeer && friends.some(f => f._id === selectedPeer._id);

  // Fetch all users
  useEffect(() => {
    if (!token) return;
    
    setUsersLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 45000
      })
      .then((res) => {
        console.log('All users loaded:', res.data);
        setAllUsers(res.data);
      })
      .catch((err) => {
        if (err.code === 'ECONNABORTED') {
          setError(
            'Request timed out. The backend server may be waking up or is slow to respond. ' +
            'Please wait a few seconds and try again. ' +
            'Backend URL: ' + import.meta.env.VITE_API_URL
          );
        } else {
          setError('Error loading all users');
        }
      })
      .finally(() => {
        setUsersLoading(false);
      });
  }, [token]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 pt-16">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {/* Sidebar */}
      <aside
        className={`
          fixed z-30 left-0 w-full h-full md:h-auto md:top-16 md:bottom-0 md:w-72 bg-white/90 dark:bg-dark-800/95 backdrop-blur-lg shadow-xl p-0 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-1/4
        `}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-100 dark:border-dark-700 bg-white/95 dark:bg-dark-900/90 sticky top-0 z-10">
          <h3 className="font-bold text-xl tracking-wide">
            {activeTab === 'friends' ? 'Friends' : 'All Users'}
          </h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl md:hidden p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-full"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 border-b border-dark-100 dark:border-dark-700">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition ${
                activeTab === 'friends'
                  ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('all-users')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition ${
                activeTab === 'all-users'
                  ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All Users
            </button>
          </div>
        </div>

        <div className="px-6 pb-2 pt-4">
          <div className="relative">
            <input
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder={activeTab === 'friends' ? 'Search friends' : 'Search users'}
              value={peerSearch}
              onChange={(e) => setPeerSearch(e.target.value)}
              aria-label="Search users"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Success/Error Messages */}
        {(successMessage || (error && !error.includes('Backend server'))) && (
          <div className="px-6 py-2">
            {successMessage && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-3 py-2 rounded-md text-sm">
                {successMessage}
              </div>
            )}
            {error && !error.includes('Backend server') && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        <div className="px-2 pb-4">
          {(activeTab === 'friends' ? peersLoading : usersLoading) ? (
            <div className="text-center py-4 text-gray-500">Loading users...</div>
          ) : error && error.includes('Backend server') ? (
            <div className="text-center py-4 text-red-500">
              <div>{error}</div>
              <div className="text-xs mt-2">
                Run: npm start in the backend folder
              </div>
            </div>
          ) : (
            <ul>
              {filteredUsers.length === 0 ? (
                <li className="text-dark-400 text-center py-4">
                  {peerSearch ? 'No users found matching your search.' : (
                    activeTab === 'friends' ? (
                      <div>
                        <div>No friends to chat with.</div>
                        <div className="text-xs mt-1">Switch to "All Users" to add friends!</div>
                      </div>
                    ) : (
                      'No users available.'
                    )
                  )}
                </li>
              ) : (
                filteredUsers.map((userItem) => {
                  const isFriend = isUserFriend(userItem._id);
                  const canChat = activeTab === 'friends' || isFriend;
                  const isRequestLoading = friendRequestLoading[userItem._id];
                  
                  return (
                    <li
                      key={userItem._id}
                      className={`flex items-center gap-2 p-2 rounded-lg transition ${
                        canChat ? 'cursor-pointer' : ''
                      } ${
                        selectedPeer?._id === userItem._id
                          ? "bg-primary-100 dark:bg-primary-900"
                          : canChat ? "hover:bg-dark-200 dark:hover:bg-dark-700" : ""
                      }`}
                      onClick={() => {
                        if (canChat) {
                          setSelectedPeer(userItem);
                          setSidebarOpen(false);
                          setUnreadCounts((prev) => ({ ...prev, [userItem._id]: 0 }));
                        }
                      }}
                    >
                      <img
                        src={userItem.profileImage || `https://ui-avatars.com/api/?name=${userItem.username}`}
                        alt=""
                        className="w-9 h-9 rounded-full border-2 border-primary-200"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="truncate font-medium block">{userItem.username}</span>
                        {activeTab === 'all-users' && (
                          <span className={`text-xs ${isFriend ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                            {isFriend ? '✓ Friend' : 'Not a friend'}
                          </span>
                        )}
                      </div>
                      
                      {/* Action buttons for All Users tab */}
                      {activeTab === 'all-users' && !isFriend && (
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendFriendRequest(userItem._id, userItem.username);
                          }}
                          disabled={isRequestLoading}
                          className={`px-3 py-1 text-xs rounded-full transition ${
                            isRequestLoading 
                              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                              : 'bg-primary-500 text-white hover:bg-primary-600'
                          }`}
                          whileHover={!isRequestLoading ? { scale: 1.05 } : {}}
                          whileTap={!isRequestLoading ? { scale: 0.95 } : {}}
                        >
                          {isRequestLoading ? (
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              <span>Sending...</span>
                            </div>
                          ) : (
                            'Add Friend'
                          )}
                        </motion.button>
                      )}
                      
                      {/* Friend status indicator for All Users tab */}
                      {activeTab === 'all-users' && isFriend && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Friends</span>
                        </div>
                      )}
                      
                      {/* Chat indicator for friends */}
                      {activeTab === 'friends' && unreadCounts[userItem._id] > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white min-w-[24px]">
                          {unreadCounts[userItem._id] > 4 ? "4+" : unreadCounts[userItem._id]}
                        </span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Sidebar overlay"
        ></div>
      )}
      {/* Main chat area */}
      <main className="flex-1 flex flex-col relative bg-white/90 dark:bg-dark-900/95 backdrop-blur-lg rounded-l-3xl shadow-lg mx-2 my-4 overflow-hidden">
        {/* Top bar */}
        <div className="p-4 border-b dark:border-dark-700 flex items-center bg-white/95 dark:bg-dark-900/90 sticky top-0 z-10">
          <button
            className="md:hidden mr-4 text-2xl p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-full"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3 relative">
            {selectedPeer && (
              <>
                <img
                  ref={avatarRef}
                  src={selectedPeer.profileImage || `https://ui-avatars.com/api/?name=${selectedPeer.username}`}
                  alt=""
                  className="w-9 h-9 rounded-full border-2 border-primary-200 cursor-pointer"
                  onClick={() => setShowProfileDropdown(v => !v)}
                  title="View profile"
                  style={{ zIndex: 20 }}
                />
                {showProfileDropdown && (
                  <UserProfileDropdown
                    user={selectedPeer}
                    anchorRef={avatarRef}
                    onClose={() => setShowProfileDropdown(false)}
                    isFriend={isSelectedPeerFriend}
                    onFriendAdded={() => setShowProfileDropdown(false)}
                    socket={socketRef.current}
                  />
                )}
              </>
            )}
            <h2 className="font-semibold text-lg truncate">
              {selectedPeer ? selectedPeer.username : "Select a user to chat"}
            </h2>
          </div>
        </div>
        {/* Messages */}
        <section className="flex-1 overflow-y-auto px-2 sm:px-8 py-4 space-y-3 bg-gradient-to-b from-white/70 dark:from-dark-900/80 to-white/95 dark:to-dark-800/95">
          {selectedPeer ? (
            messages.length === 0 ? (
              <div className="text-center text-dark-400 mt-10">No messages yet.</div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === user.id ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`
                      max-w-xs sm:max-w-md md:max-w-lg break-words
                      px-4 py-3 rounded-2xl shadow-md
                      ${msg.from === user.id
                        ? "bg-gradient-to-br from-primary-500 to-indigo-500 text-white rounded-tr-none"
                        : "bg-dark-100 dark:bg-dark-700 text-dark-900 dark:text-white rounded-tl-none"}
                      border border-primary-100 dark:border-primary-900
                      transition-all
                    `}
                  >
                    <MessagePlayer message={msg} isOwn={msg.from === user.id} />
                    <div className="text-xs text-right text-dark-400 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            <div className="flex items-center justify-center h-full text-dark-400">Select a user to start chatting.</div>
          )}
          <div ref={messagesEndRef} />
        </section>
        {/* Input */}
        {selectedPeer && canSendMessage && (
          <form
            onSubmit={sendMessage}
            className="p-4 flex gap-2 border-t dark:border-dark-700 bg-white/95 dark:bg-dark-900/90 sticky bottom-0 z-10"
          >
            {isRecording ? (
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-full border dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <span>Recording...</span>
                <span className="ml-auto">{formatTime(recordingTime)}</span>
              </div>
            ) : (
              <input
                className="w-[40vw] md:flex-1 px-4 py-3 rounded-full border dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 shadow"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Type a message..."
                autoFocus
                aria-label="Message input"
              />
            )}
            
            {/* Voice recording button */}
            <motion.button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-full shadow ${
                isRecording 
                  ? "bg-red-500 text-white" 
                  : "bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300"
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              title={isRecording ? "Stop recording" : "Record voice message"}
              aria-label={isRecording ? "Stop recording" : "Record voice message"}
            >
              {isRecording ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </motion.button>

            {/* Image upload button */}
            <motion.button
              type="button"
              onClick={handleImageSelect}
              className="p-2 rounded-full bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 shadow"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              title="Send image"
              aria-label="Send image"
              disabled={isRecording}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </motion.button>
            
            {/* Send button */}
            <motion.button
              type="submit"
              className="px-6 py-2 bg-primary-500 text-white rounded-full font-semibold shadow hover:bg-primary-600 transition"
              disabled={isRecording || !msgInput.trim()}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Send message"
            >
              Send
            </motion.button>
          </form>
        )}
        {selectedPeer && !canSendMessage && (
          <div className="p-4 text-center text-red-500 bg-white/95 dark:bg-dark-900/90 sticky bottom-0 z-10">
            You can only chat with friends. Add this user as a friend to start chatting.
          </div>
        )}
        
        
      </main>
    </div>
  );
};

export default ChatPage;
