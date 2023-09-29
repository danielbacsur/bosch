"use client";

import { createContext, useContext, ReactNode } from "react";

interface SocketContextType {}

export const SocketContext = createContext<SocketContextType | null>(null);
export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
