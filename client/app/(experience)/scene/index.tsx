"use client";

import { useSocket } from "@/components/contexts/socket";
import { Canvas } from "@react-three/fiber";
import { ObjectData, SocketContextType } from "@/lib/types";
import Porsche from "./porsche";
import {
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
  Environment,
  Center,
  Sphere,
  Line,
  Grid,
} from "@react-three/drei";
import { useMemo } from "react";
import { distanceVector, validate } from "@/lib/helpers/three";
import { Vector3 } from "three";
import { getBreakDistance } from "@/lib/utils";

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [-8, 8, -12], fov: 30 }}>
      <Lights />
      <Vehicle />
      <Shadows />
      <Background />
      <Camera />
      <Objects />
      <Transformer />
    </Canvas>
  );
}

const Lights = () => {
  return (
    <>
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        castShadow
        intensity={2}
        shadow-bias={-0.0001}
      />
      <ambientLight intensity={0.5} />
    </>
  );
};

const Vehicle = () => {
  const socket = useSocket();

  return (
    socket && (
      <>
        <Center top>
          <Porsche />
        </Center>
        <arrowHelper
          position={[0, 1.26, 0]}
          scale={socket.response.vehicle.speed}
        />
      </>
    )
  );
};

const Shadows = () => {
  return (
    <AccumulativeShadows temporal frames={100} alphaTest={0.9} scale={10}>
      <RandomizedLight
        amount={10}
        radius={8}
        ambient={0.5}
        position={[1, 5, -1]}
      />
    </AccumulativeShadows>
  );
};

const Background = () => {
  return <Environment background preset="sunset" blur={0.8} />;
};

const Camera = () => {
  return (
    <OrbitControls
      enableZoom={false}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2.2}
      autoRotate={false}
      autoRotateSpeed={0.5}
    />
  );
};

const Objects = () => {
  const socket = useSocket();

  return (
    socket &&
    socket.response.objects.map((object, index) => {
      return <Object key={index} socket={socket} object={object} />;
    })
  );
};

const Object = ({ socket, object }: { socket:SocketContextType, object: ObjectData }) => {
  return (
    <>
      <Line
        points={[
          [0, 0, 0],
          [object.distance.x, 0, object.distance.y],
        ]}
        lineWidth={1}
        color={validate(socket, object) ? "red" : "black"}
      />
      <Sphere
        args={[0.5, 16, 16]}
        position={[object.distance.x, 0, object.distance.y]}
      >
        <meshBasicMaterial color={validate(socket, object) ? "red" : "black"} />
      </Sphere>
    </>
  );
};

const Transformer = () => {
  const socket = useSocket();

  return (
    socket && (
      <group rotation={[0, -socket.response.vehicle.rotation, 0]}>
        <Grid args={[20, 20]} />;
      </group>
    )
  );
};
