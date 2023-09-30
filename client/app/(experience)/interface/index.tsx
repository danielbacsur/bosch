"use client";

import { useSocket } from "@/components/contexts/socket";
import { useBrake } from "@/components/contexts/brake";

export default function Interface() {
  return (
    <>
      <Overlay />
      <Brakes />
      <Socketes />
    </>
  );
}

const Overlay = () => {
  return (
    <>
      <div className="absolute top-12 left-12 z-10">Code Like A Bosch</div>
    </>
  );
};

const Brakes = () => {
  const brake = useBrake();
  return (
    brake && (
      <>
        <div className="absolute top-12 right-12 z-10">{brake.collision}</div>
      </>
    )
  );
};

const Socketes = () => {
  const socket = useSocket();

  return (
    socket && (
      <>
        <div className="absolute top-0 left-0 bottom-0 right-0 z-10 pointer-events-none">
          <div className="absolute bottom-[8vh] left-1/2 -translate-x-1/2">
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
        </div>
      </>
    )
  );
};
