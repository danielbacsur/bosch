"use client";

import { useSocket } from "@/components/contexts/socket";
import { Canvas } from "@react-three/fiber";
import { validate } from "@/lib/helpers/three";
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
import { Fragment } from "react";

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [-8, 8, -12], fov: 30 }}>
      <Relative />
      <Absolute />
    </Canvas>
  );
}

const Relative = () => {
  return (
    <>
      <Vehicle />
      <Shadows />
      <Background />
      <Camera />
      <Objects />
    </>
  );
};

const Absolute = () => {
  const socket = useSocket();

  return (
    socket && (
      <group rotation={[0, -socket.response.vehicle.rotation, 0]}>
        <group
          position={[
            -socket.response.vehicle.position.x,
            0,
            -socket.response.vehicle.position.y,
          ]}
        >
          <Lights />
       
      <Grid
        position={[0, -0.01, 0]}
        args={[10.5, 10.5]}
        cellSize={0.25}
        cellThickness={0.25}
        cellColor={"#6f6f6f"}
        sectionSize={1}
        sectionThickness={0.8}
        sectionColor={"#9d4b4b"}
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid={true}
      />
         </group>
      </group>
    )
  );
};

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
  const socket = useSocket()
  return (
    <>
    <Center top>
      <Porsche />
    </Center>
    <arrowHelper scale={socket?.response.vehicle.speed} position={[0, 1.25, 0]} rotation={[ Math.PI / 2,0, -socket?.response.vehicle.yaw!]}/>
    </>
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

  return socket?.response.objects.map((object, index) => {
    return (
      <Fragment key={index}>
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
          <meshBasicMaterial
            color={validate(socket, object) ? "red" : "black"}
          />
        </Sphere>
      </Fragment>
    );
  });
};

const Transformer = () => {
  const socket = useSocket();

  return (
    socket && (
      <group rotation={[0, -socket.response.vehicle.rotation, 0]}>
        <group
          position={[
            -socket.response.vehicle.position.x,
            0,
            -socket.response.vehicle.position.y,
          ]}
        ></group>
      </group>
    )
  );
};
