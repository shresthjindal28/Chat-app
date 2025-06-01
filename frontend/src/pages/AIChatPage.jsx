import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import Lottie from 'lottie-react';
import ThreeBackground from '../components/three/ThreeBackground';

// Importing animation data
const thinkingAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Thinking",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Dot 1",
      sr: 1,
      ks: {
        o: { a: 1, k: [
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [30] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 15, s: [100] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [30] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 45, s: [100] },
          { t: 60, s: [30] }
        ] },
        p: { a: 0, k: [30, 50, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [10, 10] },
              p: { a: 0, k: [0, 0] },
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: "Transform"
            }
          ],
          nm: "Ellipse 1",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Dot 2",
      sr: 1,
      ks: {
        o: { a: 1, k: [
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 10, s: [30] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 25, s: [100] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 40, s: [30] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 55, s: [100] },
          { t: 70, s: [30] }
        ] },
        p: { a: 0, k: [50, 50, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [10, 10] },
              p: { a: 0, k: [0, 0] },
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: "Transform"
            }
          ],
          nm: "Ellipse 1",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Dot 3",
      sr: 1,
      ks: {
        o: { a: 1, k: [
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 20, s: [30] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 35, s: [100] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 50, s: [30] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 65, s: [100] },
          { t: 80, s: [30] }
        ] },
        p: { a: 0, k: [70, 50, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [10, 10] },
              p: { a: 0, k: [0, 0] },
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Fill 1",
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: "Transform"
            }
          ],
          nm: "Ellipse 1",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ]
};

const AIChatPage = () => {
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sendAnimation, setSendAnimation] = useState(false);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    // Welcome message from AI
    setTimeout(() => {
      setMessages([
        { 
          role: 'assistant', 
          content: "Hello! I'm your AI assistant. How can I help you today?" 
        }
      ]);
    }, 800);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload and analyze image
    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/images/analyze`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessages(prev => [
        ...prev,
        { 
          role: 'user', 
          content: 'Analyze this image:',
          image: reader.result
        },
        { 
          role: 'assistant', 
          content: res.data.description 
        }
      ]);
    } catch (error) {
      console.error('Image analysis error:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'Sorry, I had trouble analyzing that image. Please try again.' 
        }
      ]);
    } finally {
      setLoading(false);
      setImagePreview(null);
    }
  };

  const generateImage = async () => {
    if (!input.trim()) return;
    
    setIsGeneratingImage(true);
    setLoading(true);
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/images/generate`,
        { prompt: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [
        ...prev,
        { 
          role: 'user', 
          content: `Generate an image: ${input}` 
        },
        { 
          role: 'assistant', 
          content: 'Here is your generated image:',
          image: res.data.imageUrl
        }
      ]);
      
      setInput('');
    } catch (error) {
      console.error('Image generation error:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'Sorry, I had trouble generating that image. Please try again.' 
        }
      ]);
    } finally {
      setIsGeneratingImage(false);
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setSendAnimation(true);
    setTimeout(() => setSendAnimation(false), 500);
    
    const userMsg = { role: 'user', content: input };
    const userInput = input.trim();
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/chat`,
        { message: userInput },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000
        }
      );
      
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { role: 'assistant', content: res.data.reply }
        ]);
        setLoading(false);
      }, 1200);
      
    } catch (err) {
      console.error('AI chat error:', err);
      let errorMessage = err.response?.data?.error || 'Error sending message';
      setMessages((msgs) => [
        ...msgs,
        { role: 'assistant', content: 'Error: ' + errorMessage }
      ]);
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    send: { scale: [1, 1.2, 0.9, 1], transition: { duration: 0.5 } }
  };

  return (
    <>
      <ThreeBackground orbs={8} />
      <motion.div 
        className="flex flex-col items-center justify-center min-h-screen pt-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-full max-w-3xl bg-dark-800/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-dark-700/30"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Header */}
          <motion.div 
            className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 p-6 flex items-center gap-4 border-b border-primary-600/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
              <p className="text-sm text-primary-200 font-medium">Online • Powered by GPT</p>
            </div>
          </motion.div>
          
          {/* Chat area */}
          <motion.div 
            className="flex-1 overflow-y-auto p-6 space-y-6 h-[60vh] scrollbar-thin scrollbar-thumb-primary-500/20 scrollbar-track-transparent"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div 
                    className={`
                      max-w-[85%] p-4 rounded-2xl shadow-lg backdrop-blur-sm
                      ${msg.role === 'user' 
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-tr-none' 
                        : 'bg-dark-700/80 text-white rounded-tl-none border border-dark-600/30'}
                    `}
                  >
                    {msg.image && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        <img 
                          src={msg.image} 
                          alt="Shared content" 
                          className="max-w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    <p className="text-[15px] leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-dark-700/80 p-4 rounded-2xl rounded-tl-none border border-dark-600/30 h-12 w-20 flex items-center justify-center">
                  <div className="w-12 h-6">
                    <Lottie 
                      animationData={thinkingAnimation} 
                      loop={true} 
                      autoplay={true}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </motion.div>
          
          {/* Image Preview */}
          {imagePreview && (
            <motion.div 
              className="p-4 border-t border-dark-700/50 bg-dark-800/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative max-w-xs mx-auto">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="rounded-lg max-w-full h-auto"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-dark-800/80 text-white p-1 rounded-full hover:bg-dark-700"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Input area */}
          <motion.form 
            onSubmit={sendMessage} 
            className="p-6 border-t border-dark-700/50 flex gap-3 bg-dark-800/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl bg-dark-700/80 text-white hover:bg-dark-600 transition-all duration-200"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <input
              className="flex-1 px-5 py-3 rounded-xl bg-dark-700/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-dark-600/30 transition-all duration-200"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything or describe an image to generate..."
              disabled={loading}
            />
            <motion.button
              type="submit"
              className="p-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-primary-500 hover:to-primary-400 transition-all duration-200 shadow-lg shadow-primary-500/20"
              disabled={loading || !input.trim()}
              variants={buttonVariants}
              initial="rest"
              animate={sendAnimation ? "send" : "rest"}
              whileHover="hover"
              whileTap="tap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </motion.button>
          </motion.form>
        </motion.div>
        
        {/* Suggestions */}
        <motion.div 
          className="mt-8 flex flex-wrap gap-3 justify-center max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            "Generate a sunset landscape",
            "Create a cute robot character",
            "Design a futuristic city",
            "Make an abstract art piece"
          ].map((suggestion, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setInput(suggestion);
                generateImage();
              }}
              className="px-4 py-2.5 bg-dark-700/70 backdrop-blur-sm rounded-xl text-sm text-white hover:bg-primary-500/90 border border-dark-600/30 transition-all duration-200"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(99, 102, 241, 0.9)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
};

export default AIChatPage;
