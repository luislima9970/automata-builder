import type { EdgeGeometry } from "../../../automata-visualizer/src/EdgeGeometry.js";

interface Props {
  geometry: EdgeGeometry;
}

function TransitionEdge({ geometry }: Props) {
  return (
    <g>
      <path d={geometry.path} stroke="black" fill="none" markerEnd="url(#arrow)" />
      <text x={geometry.labelPosition.x} y={geometry.labelPosition.y} textAnchor="middle" fontSize={12}>
        {geometry.label}
      </text>
    </g>
  );
}

export default TransitionEdge;