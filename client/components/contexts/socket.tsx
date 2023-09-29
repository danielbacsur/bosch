"use client";

import ReconnectingWebSocket from "reconnecting-websocket";
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
} from "react";

interface SocketContextType {
  socket: ReconnectingWebSocket;
  connection: ConnectionType;
  request: RequestModifierType;
  response: ResponseType | null;
}

interface RequestType {
  type: "connection" | "data";
}

interface ResponseType {
  timestamp: number;
  vehicle: Vehicle;
  objects: ObjectData[];
}

interface Vehicle {
  yaw: number;
  speed: number;
}

interface ObjectData {
  distance: Vector2D;
  speed: Vector2D;
}

interface Vector2D {
  x: number;
  y: number;
}

interface RequestModifierType extends RequestType {
  timestamp: number;
  setTimestamp: (timestamp: number) => void;
}

interface ConnectionType {
  minkey: number;
  maxkey: number;
  length: number;
  deltat: number;
}

export const SocketContext = createContext<SocketContextType | null>(null);
export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: ReactNode }) => {
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
  const [response, setResponse] = useState<ResponseType | null>(null);

  // Connect to WebSocket server
  const socket = useMemo(() => {
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

    return webSocket;
  }, []);

  // Send request if request is updated
  useEffect(() => {
    socket && socket.send(JSON.stringify(request));
  }, [socket, request]);

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

export default SocketProvider;

const connectionRequest = JSON.stringify({
  type: "connection",
} as RequestType);
