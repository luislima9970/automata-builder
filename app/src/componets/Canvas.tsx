import { useRef } from "react";
import { AutomataLayout } from "../../../automata-visualizer/src/AutomataLayout.js";
import { useCamera } from "../hooks/useCamera";
import { buildSampleAutomata } from "../data/sampleAutomata";
import StateNode from "./StateNode";
import TransitionEdge from "./TransitionEdge";

interface Props {
  width: number;
  height: number;
}

function Canvas({ width, height }: Props) {
  const automataRef = useRef(buildSampleAutomata());
  const layoutRef = useRef(new AutomataLayout(automataRef.current));
  const { camera, handleMouseMove, handleWheel } = useCamera(width, height);

  return (
    <svg
      width={width}
      height={height}
      viewBox={camera.viewBoxString}
      style={{ border: "1px solid black" }}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
    >
      {automataRef.current.getStates().map(state => {
        const pos = layoutRef.current.getPosition(state.getId());
        const name : string | undefined = automataRef.current.getStateName(state.getId());

        if (name === undefined) return null;
        if (!pos) return null;
        return (
          <StateNode key={state.getId()} position={pos} name={name} isAccepting={state.getAcceptance()} />
        );
      })}
      {layoutRef.current.getEdgeGeometries().map((geom, i) => (
        <TransitionEdge key={i} geometry={geom} />
      ))}
    </svg>
  );
}

export default Canvas;