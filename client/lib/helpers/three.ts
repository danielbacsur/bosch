import { ObjectData, SocketContextType, Vector2D } from "@/lib/types";
import { Vector2, Vector3 } from "three";

export function distanceVector(v1: Vector3, v2: Vector3) {
  var dx = v1.x - v2.x;
  var dy = v1.y - v2.y;
  var dz = v1.z - v2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export const validate = (socket: SocketContextType, object: ObjectData) => {
  const inDanger =
    distanceVector(
      new Vector3(0, 0, 0),
      new Vector3(object.distance.x, 0, object.distance.y)
    ) < getBreakDistance(socket.response.vehicle.speed);
  const isValid = object.distance.x !== 0 && object.distance.y !== 0;

  return inDanger && isValid;
};

export function getBreakDistance(speed?: number) {
  return 10;
}

export function convert (vec: Vector2D) {
  return new Vector3(vec.x, 0, vec.y)
}