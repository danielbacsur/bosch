"use client";

import { useSocket } from "@/components/contexts/socket";
import { useBrake } from "@/components/contexts/brake";
import { useEffect, useRef, useState } from "react";

export default function Interface() {
  return <Overlay />;
}

function Overlay() {
  const socket = useSocket();
  const brake = useBrake();

  const [slider, setSlider] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
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
            return socket.connection.maxkey;
          } else return prevValue + 0.02;
        });
      }, 10);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.request.setTimestamp(slider);
  }, [socket, slider]);

  return (
    socket &&
    brake && (
      <div className="absolute top-0 left-0 bottom-0 right-0 pointer-events-none z-10">
        <div className="absolute top-[5vw] left-[5vw]">
          code like a bosch —
          <br />
          <br />
          use the slider to move
          <br />
          around in time or{" "}
          <button
            onClick={handleClick}
            className="underline pointer-events-auto"
          >
            just press ME
          </button>
          .
        </div>
        <div className="absolute top-[5vw] right-[5vw]">
          odyssey by{" "}
          <a
            href="https://github.com/danielbacsur"
            className="underline pointer-events-auto"
          >
            daniel
          </a>
        </div>
        <div className="absolute bottom-[5vw] left-[5vw] right-[5vw] flex space-x-[2.5vh] items-center">
          <span>{socket.connection.minkey.toFixed(2)}</span>
          <input
            type="range"
            className="pointer-events-auto"
            min={socket.connection.minkey}
            max={socket.connection.maxkey}
            onChange={(e) => setSlider(parseFloat(e.target.value))}
            step={0.00000001}
            value={slider}
          />
          <span>{socket.connection.maxkey.toFixed(2)}</span>
        </div>
        <div className="absolute bottom-[10vw] left-1/2 -translate-x-1/2">
          <span className="text-[5vh]">&lt;{brake.collision || "NaN"}&gt;</span>
        </div>
      </div>
    )
  );
}
