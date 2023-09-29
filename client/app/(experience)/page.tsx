import Interface from "./interface";
import Scene from "./scene";

export default function Home() {
  return (
    <>
      <div className="absolute top-0 left-0 bottom-0 right-0 pointer-events-none z-10">
        <Interface />
      </div>
      <div className="absolute top-0 left-0 bottom-0 right-0 pointer-events-auto z-0">
        <Scene />
      </div>
    </>
  );
}
