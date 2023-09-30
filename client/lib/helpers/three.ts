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


export function getBreakDistance(vEgo: number, aMax: number = -9, jerk: number = -30): number {
  const t = aMax / Math.abs(jerk);
  const s1 = vEgo * t + 0.5 * 0.5 * aMax * t * t;
  const v1 = vEgo + aMax * t;
  const s2 = -v1 * v1 / (2 * aMax);

  return s1 + s2 + 2.4;
}

export function convert (vec: Vector2D) {
  return new Vector3(vec.x, 0, vec.y)
}