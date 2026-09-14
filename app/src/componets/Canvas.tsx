import { useRef, useReducer } from "react";
import { Camera } from "../../../automata-visualizer/src/Camera.js";

function Canvas() {
  const cameraRef = useRef(new Camera(0, 0, 1, 800, 600));
  const [, forceRender] = useReducer(x => x + 1, 0);

  function handleMouseMove(e: React.MouseEvent) {
    if (e.buttons === 1) { // left mouse button is held down
      cameraRef.current.pan(e.movementX, e.movementY);
      forceRender();
    }
  }

  return (
    <svg
      width={800}
      height={600}
      viewBox={cameraRef.current.viewBoxString}
      style={{ border: "1px solid black" }}
      onMouseMove={handleMouseMove}
    >
      <rect x={350} y={250} width={100} height={100} fill="steelblue" />
    </svg>
  );
}

export default Canvas;