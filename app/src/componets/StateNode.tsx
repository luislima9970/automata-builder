import type { Position } from "../../../automata-visualizer/src/Position.js";
import StateName from "./StateName";

interface Props {
    position: Position;
    name: string;
    isAccepting: boolean;
    isStart: boolean;
    isSelected: boolean;
    isHighlighted: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
    editable: boolean;
    onRename: (name: string) => boolean;
}

function StateNode({
    position,
    name,
    isAccepting,
    isStart,
    isSelected,
    isHighlighted,
    onMouseDown,
    onClick,
    editable,
    onRename,
}: Props) {
    const color = isSelected ? "blue" : "black";
    const fill = isHighlighted ? "#d3f9d8" : "white";

    return (
        <g onMouseDown={onMouseDown} onClick={onClick}>
            <circle
                cx={position.x}
                cy={position.y}
                r={30}
                fill={fill}
                stroke={color}
                strokeWidth={1}
            />

            {isStart && (
                <path
                    d={`M ${position.x - 70} ${position.y}
                        H ${position.x - 30}
                        M ${position.x - 38} ${position.y - 5}
                        L ${position.x - 30} ${position.y}
                        L ${position.x - 38} ${position.y + 5}`}
                    fill="none"
                    stroke="black"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pointerEvents="none"
                />
            )}

            {isAccepting && (
                <circle
                    cx={position.x}
                    cy={position.y}
                    r={28}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    pointerEvents="none"
                />
            )}

            <StateName
                x={position.x}
                y={position.y}
                name={name}
                editable={editable}
                onRename={onRename}
            />
        </g>
    );
}

export default StateNode;

