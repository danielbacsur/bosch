"use client";

import { useSocket } from "@/components/contexts/socket";
import { useBrake } from "@/components/contexts/brake";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/lib/hooks/debounce";
import { useSearchParams } from "next/navigation";
import { getBreakDistance, validate } from "@/lib/helpers/three";

export default function Interface() {
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 pointer-events-none z-10">
      <Socket />
      <Brake />
    </div>
  );
}

const Socket = () => {
  const socket = useSocket();
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug");

  const [slider, setSlider] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlay = () => {
    if (!socket) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      intervalRef.current = setInterval(() => {
        setSlider((prevValue) => {
          if (prevValue < socket.connection.minkey) {
            return socket.connection.minkey;
          } else if (prevValue >= socket.connection.maxkey) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            return socket.connection.minkey;
          } else return prevValue + 0.02;
        });
      }, 10);
    }
  };

  useEffect(() => {
    socket?.request.setTimestamp(slider);
  }, [slider]);

  return (
    <>
      <div className="absolute top-[5vw] left-[5vw]">
        code like a bosch —
        <br />
        <br />
        use the slider to move
        <br />
        around in time or{" "}
        <button onClick={handlePlay} className="underline pointer-events-auto">
          just press ME
        </button>
        .
        <br />
        <br />
        feel free to navigate around,
        <br />
        while the simulation is playing
      </div>
      <div className="absolute top-[5vw] right-[5vw] text-right">
        odyssey by{" "}
        <a
          href="https://github.com/danielbacsur"
          className="underline pointer-events-auto"
        >
          daniel
        </a>
        {debug && (
          <>
            <br />
            <br />
            speed: {socket?.response.vehicle.speed.toFixed(2)} m/s
            <br />
            <br />
            yaw: {socket?.response.vehicle.yaw.toFixed(4)} rad
            <br />
            <br />
            rotation: {socket?.response.vehicle.rotation.toFixed(4)} rad
            <br />
            <br />
            position: [{socket?.response.vehicle.position.x.toFixed(2)},{" "}
            {socket?.response.vehicle.position.y.toFixed(2)}] m
            <br />
            <br />
            danger zone:{" "}
            {(getBreakDistance(socket?.response.vehicle.speed!) - 2.6).toFixed(
              2
            )}{" "}
            m
            <br />
            <br />
            valid objects:{" "}
            {
              socket?.response.objects.filter(
                (object) => object.distance.x !== 0 && object.distance.y !== 0
              ).length
            }
          </>
        )}
      </div>
      <div className="absolute bottom-[5vw] left-[5vw] right-[5vw] flex space-x-[2.5vh] items-center">
        <span>{socket?.connection.minkey.toFixed(2)}</span>
        <input
          type="range"
          className="pointer-events-auto"
          min={socket?.connection.minkey}
          max={socket?.connection.maxkey}
          onChange={(e) => setSlider(parseFloat(e.target.value))}
          step={0.0001}
          value={slider}
        />
        <span>{socket?.connection.maxkey.toFixed(2)}</span>
      </div>
    </>
  );
};

const Brake = () => {
  const brake = useBrake();

  const displayed = useDebounce(brake?.collision || "NaN");

  return (
    <div className="absolute bottom-[10vw] left-1/2 -translate-x-1/2">
      <span className="text-[5vh]">&lt;{displayed}&gt;</span>
    </div>
  );
};
