import type { Position } from "../../../automata-visualizer/src/Position.js";

interface Props {
    position: Position;
    name: string;
    isAccepting: boolean;
    isStart : boolean;
    isSelected : boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
}

function StateNode({ position, name, isAccepting,isStart,isSelected, onMouseDown, onClick }: Props) {

    let color : string = "black";

    if (isStart) color = "green";

    if (isSelected) color = "blue";


    return (
        <g onMouseDown={onMouseDown} onClick={onClick}>

            <circle cx={position.x} cy={position.y} r={30} fill = "white" stroke={color} strokeWidth={1} />
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