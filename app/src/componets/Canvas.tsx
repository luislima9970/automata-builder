import AutomataView from "./AutomataView"
import { useCamera } from "../hooks/useCamera";


interface Props {
  width: number;
  height: number;
}

function Canvas({ width, height }: Props) {
  const { camera, handleMouseMove, handleWheel } = useCamera(width, height);

  return (
    <svg width={width} height={height} viewBox={camera.viewBoxString} style={{ border: "1px solid black" }} onMouseMove={handleMouseMove} onWheel={handleWheel}>
      <AutomataView />
    </svg>
  );
}

export default Canvas;