import AutomataView from "./AutomataView"
import { useCamera } from "../hooks/useCamera";
import { useAutomataLayout } from "../hooks/useAutomataLayout";
import { useNodeDrag } from "../hooks/useNodeDrag";


interface Props {
  width: number;
  height: number;
}

function Canvas({ width, height }: Props) {
  const { camera, handleMouseMove: handleCameraMove, handleWheel } = useCamera(width, height);
  const { automata, layout, moveState } = useAutomataLayout();
  const { startDrag, handleDragMove, endDrag } = useNodeDrag(camera.zoom, moveState);

  function handleMouseMove(e: React.MouseEvent) {
    const wasDragging = handleDragMove(e);
    if (!wasDragging) handleCameraMove(e);
  }

  return (
    <svg width={width} height={height} viewBox={camera.viewBoxString} onMouseMove={handleMouseMove} onWheel={handleWheel} onMouseUp={endDrag} onContextMenu={(e) => e.preventDefault()}>
      <AutomataView automata={automata} layout={layout} onNodeMouseDown={startDrag}/>
    </svg>
  );
}

export default Canvas;