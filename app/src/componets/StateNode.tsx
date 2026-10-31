import type { Position } from "../../../automata-visualizer/src/Position.js";

interface Props {
    position: Position;
    name: string;
    isAccepting: boolean;
    isStart: boolean;
    isSelected: boolean;
    isHighlighted: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
}

function StateNode({ position, name, isAccepting, isStart, isSelected, isHighlighted, onMouseDown, onClick }: Props) {

    let color: string = "black";
    let fill: string = "white"

    fill = isHighlighted ? "#d3f9d8" : "white";
    if (isSelected) color = "blue";



    return (
        <g onMouseDown={onMouseDown} onClick={onClick}>

            <circle
                cx={position.x} cy={position.y} r={30} fill={fill} stroke={color} strokeWidth={1} />
            {isStart && (
                <path
                    d={`M ${position.x - 70} ${position.y} H ${position.x - 30} M ${position.x - 38} ${position.y - 5} L ${position.x - 30} ${position.y} L ${position.x - 38} ${position.y + 5}`} fill="none" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none"
                />
            )}
            {isAccepting && (
                <circle cx={position.x} cy={position.y} r={28} fill="none" stroke={color} strokeWidth={1} />
            )}
            <text x={position.x} y={position.y} textAnchor="middle" dominantBaseline="middle" fill="black" fontSize={14}>
                {name}
            </text>
        </g>
    );
}

export default StateNode;