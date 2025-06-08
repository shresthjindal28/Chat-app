import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ["websocket"],
    });
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
