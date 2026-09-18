import type { EdgeGeometry } from "../../../automata-visualizer/src/EdgeGeometry.js";

interface Props {
  geometry: EdgeGeometry;
  onClick: (e: React.MouseEvent) => void;
}

function TransitionEdge({ geometry, onClick }: Props) {
  return (
    <g onClick={onClick}>
      <path d={geometry.path} stroke="black" fill="none" markerEnd="url(#arrow)" />
      <text x={geometry.labelPosition.x} y={geometry.labelPosition.y} textAnchor="middle" fontSize={12}>
        {geometry.label}
      </text>
    </g>
  );
}

export default TransitionEdge;