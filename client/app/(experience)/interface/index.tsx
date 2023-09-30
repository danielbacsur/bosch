"use client";

import { useSocket } from "@/components/contexts/socket";

export default function Interface() {
  const socket = useSocket();

  return (
    socket && (
      <div className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 z-10">
        <div className="flex space-x-4">
          <div>{socket.connection.minkey}</div>
          <input
            type="range"
            min={socket.connection.minkey}
            max={socket.connection.maxkey}
            step={0.00000001}
            value={socket.request.timestamp}
            onChange={(e) =>
              socket.request.setTimestamp(parseFloat(e.target.value))
            }
            className="pointer-events-auto"
          />
          <div>{socket.connection.maxkey}</div>
        </div>
        <div>{socket.request.timestamp}</div>
      </div>
    )
  );
}
