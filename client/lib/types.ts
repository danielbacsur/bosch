import type ReconnectingWebSocket from "reconnecting-websocket";

export interface SocketContextType {
  socket: ReconnectingWebSocket | null;
  connection: ConnectionType;
  request: RequestModifierType;
  response: ResponseType;
}

export interface RequestType {
  type: "connection" | "data";
}

export interface ResponseType {
  timestamp: number;
  deltatime: number;
  vehicle: Vehicle;
  objects: ObjectData[];
}

export interface Vehicle {
  yaw: number;
  speed: number;
  rotation: number;
  position: Vector2D;
}

export interface ObjectData {
  distance: Vector2D;
  speed: Vector2D;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface RequestModifierType extends RequestType {
  timestamp: number;
  setTimestamp: any;
}

export interface ConnectionType {
  minkey: number;
  maxkey: number;
  length: number;
  deltat: number;
}

///////////////////////////////////////////////////////////////////

export interface BrakeContextType {
  collision: Collision;
}

export enum Collision {
  NONE = "",
  CPNCO = "CPNCO",
  CPTA = "CPTA",
  CPLA = "CPLA",
  ERROR = "ERROR",
}
