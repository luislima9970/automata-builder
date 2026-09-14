import type { Position } from "../../../automata-visualizer/src/Position.js";

interface Props {
    position: Position;
    name: string;
    isAccepting: boolean;
}

function StateNode({ position, name, isAccepting }: Props) {
    return (
        <g>
            <circle cx={position.x} cy={position.y} r={30} fill={isAccepting ? "green" : "gray"} />
            {isAccepting && (
                <circle cx={position.x} cy={position.y} r={22} fill="none" stroke="white" strokeWidth={2} />
            )}
            <text x={position.x} y={position.y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={14}>
                {name}
            </text>
        </g>
    );
}

export default StateNode;