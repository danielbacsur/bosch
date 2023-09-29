"use client";

import { useSocket } from "@/components/contexts/socket";
import { useEffect } from "react";

export default function Interface() {
  const socket = useSocket();

  useEffect(() => {
    const interval = setInterval(() => {
      socket?.request.setTimestamp((prevCount: number) => prevCount + 0.01);
    }, 10);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);  

  return (
    <div className="w-full absolute bottom-0 grid place-items-center z-10">
      <div className="flex space-x-4">
        <div>{socket?.connection.minkey}</div>
        <input
          type="range"
          min={socket?.connection.minkey}
          max={socket?.connection.maxkey}
          step={0.00000001}
          value={socket?.request.timestamp}
          onChange={(e) =>
            socket?.request.setTimestamp(parseFloat(e.target.value))
          }
          className="pointer-events-auto"
        />
        <div>{socket?.connection.maxkey}</div>
      </div>
      <div>{socket?.request.timestamp}</div>
    </div>
  );
}
