"use client";

import ReconnectingWebSocket from "reconnecting-websocket";
import { createContext, useContext, ReactNode, useMemo } from "react";

interface SocketContextType {
  socket: ReconnectingWebSocket;
}

export const SocketContext = createContext<SocketContextType | null>(null);
export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useMemo(() => {
    const webSocket = new ReconnectingWebSocket("ws://localhost:8765");
    webSocket.onopen = () => console.log("WebSocket connection started.");
    webSocket.onclose = () => console.log("WebSocket connection closed.");
    webSocket.onmessage = (event) => console.log("Message recieved.");
    return webSocket;
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
