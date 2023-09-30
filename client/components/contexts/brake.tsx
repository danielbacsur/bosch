"use client";

import { BrakeContextType, Collision } from "@/lib/types";
import { validate } from "@/lib/helpers/three";
import { useSocket } from "./socket";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from "react";

export const BrakeContext = createContext<BrakeContextType | null>(null);
export const useBrake = () => useContext(BrakeContext);

export const BrakeProvider = ({ children }: { children: ReactNode }) => {
  const socket = useSocket();

  const collision = useMemo(() => {
    if (!socket) return Collision.ERROR;

    const cpnco =
      socket.response.vehicle.speed > 0 &&
      socket.response.vehicle.yaw === 0 &&
      socket.response.objects.some((object) => {
        validate(socket, object) &&
          object.speed.x < 0 &&
          object.speed.y === 0 &&
          object.distance.x > 0 &&
          object.distance.y > 0;
      });

    const cpta =
      socket.response.vehicle.speed > 0 &&
      socket.response.vehicle.yaw !== 0 &&
      socket.response.objects.some((object) => validate(socket, object));

    const cpla =
      socket.response.vehicle.speed > 0 &&
      socket.response.vehicle.yaw === 0 &&
      socket.response.objects.some((object) => {
        validate(socket, object) &&
          object.speed.x === 0 &&
          object.speed.y > 0 &&
          object.distance.x === 0 &&
          object.distance.y > 0;
      });

    if ([cpnco, cpta, cpla].filter(Boolean).length === 0) {
      return Collision.NONE;
    }

    if ([cpnco, cpta, cpla].filter(Boolean).length === 1) {
      if (cpnco) return Collision.CPNCO;
      if (cpta) return Collision.CPTA;
      if (cpla) return Collision.CPLA;
    }

    return Collision.ERROR;
  }, [socket]);

  useEffect(() => {
    console.log(collision);
  }, [collision]);

  return (
    <BrakeContext.Provider value={{ collision }}>
      {children}
    </BrakeContext.Provider>
  );
};
