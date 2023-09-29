"use client";

import ReconnectingWebSocket from "reconnecting-websocket";
import {
  SocketContextType,
  ConnectionType,
  ResponseType,
  RequestType,
} from "@/lib/types";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useMemo,
} from "react";
import { defaultResponse } from "@/lib/helpers/socket";

export const SocketContext = createContext<SocketContextType | null>(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  // WebSocket request hooks
  const [type, setType] = useState<"connection" | "data">("data");
  const [timestamp, setTimestamp] = useState<number>(0);
  const [connection, setConnection] = useState<ConnectionType>({
    minkey: 0,
    maxkey: 60,
    length: 60,
    deltat: 60,
  });

  // WebSocket request
  const request = useMemo(() => ({ type, timestamp }), [type, timestamp]);

  // WebSocket response
  const [response, setResponse] = useState<ResponseType>(defaultResponse);

  // Connect to WebSocket server
  const [socket, setSocket] = useState<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    const webSocket = new ReconnectingWebSocket("ws://localhost:8765");

    webSocket.onopen = () => {
      const connectionRequest = { type: "connection" } as RequestType;
      const connectionString = JSON.stringify(connectionRequest);
      webSocket.send(connectionString);
    };
    webSocket.onclose = () => console.log("WebSocket connection closed.");
    webSocket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "connection") {
        setConnection(data);
      } else {
        setResponse(data);
      }
    };

    setSocket(webSocket);

    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, []);

  // Send request if request is updated
  useEffect(() => {
    socket && socket.send(JSON.stringify(request));
  }, [socket, request]);

  useEffect(() => {
    response && timestamp === 0 && setTimestamp(response.timestamp);
  }, [socket, response]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connection,
        request: {
          type,
          timestamp,
          setTimestamp,
        },
        response,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const connectionRequest = JSON.stringify({
  type: "connection",
} as RequestType);
