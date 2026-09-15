import type { Position } from "../../../automata-visualizer/src/Position.js";

interface Props {
    position: Position;
    name: string;
    isAccepting: boolean;
    isStart : boolean;
}

function StateNode({ position, name, isAccepting,isStart }: Props) {
    return (
        <g>
            <circle cx={position.x} cy={position.y} r={30} fill = "none" stroke={(isStart ? "green" : "black")} strokeWidth={1} />
            {isAccepting && (
                <circle cx={position.x} cy={position.y} r={28} fill="none" stroke="black" strokeWidth={1} />
            )}
            <text x={position.x} y={position.y} textAnchor="middle" dominantBaseline="middle" fill="black" fontSize={14}>
                {name}
            </text>
        </g>
    );
}

export default StateNode;