import { useRef, useReducer, useEffect } from "react";
import { Camera } from "../../../automata-visualizer/src/Camera.js";

interface Props {

    height: number;
    width: number;

};

function Canvas({ height, width }: Props) {
    const cameraRef = useRef(new Camera(0, 0, 1, height, width));
    const [, forceRender] = useReducer(x => x + 1, 0);

    function handleMouseMove(e: React.MouseEvent) {
        if (e.buttons === 1) {
            cameraRef.current.pan(e.movementX, e.movementY);
            forceRender();
        }
    }

    useEffect(() => {
        cameraRef.current.resize(width, height);
        forceRender();
    }, [width, height]);

    function handleWheel(e: React.WheelEvent) {
        const factor = e.deltaY < 0 ? 1.1 : 0.9;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cameraRef.current.zoomAt(x, y, factor);
        forceRender();
    }

    return (
        <svg
            width={width}
            height={height}
            viewBox={cameraRef.current.viewBoxString}
            style={{ border: "1px solid black" }}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
        >
            <rect x={350} y={250} width={100} height={100} fill="steelblue" />
        </svg>
    );
}

export default Canvas;