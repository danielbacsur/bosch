"use client";

import Interface from "./interface";
import Scene from "./scene";

export default function Home({ params }: { params: { slug: string } }) {
  return (
    <>
      <Interface />
      <Scene />
    </>
  );
}
