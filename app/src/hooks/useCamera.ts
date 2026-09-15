import { useRef, useReducer, useEffect } from "react";
import { Camera } from "../../../automata-visualizer/src/Camera.js";

export function useCamera(width: number, height: number) {
    const cameraRef = useRef(new Camera(0, 0, 1, width, height));
    const [, forceRender] = useReducer(x => x + 1, 0);

    useEffect(() => {
        cameraRef.current.resize(width, height);
        forceRender();
    }, [width, height]);

    function handleMouseMove(e: React.MouseEvent) {
        if (e.buttons === 2) {
            cameraRef.current.pan(e.movementX, e.movementY);
            forceRender();
        }
    }

    function handleWheel(e: React.WheelEvent) {
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        const rect = e.currentTarget.getBoundingClientRect();
        cameraRef.current.zoomAt(e.clientX - rect.left, e.clientY - rect.top, factor);
        forceRender();
    }

    return { camera: cameraRef.current, handleMouseMove, handleWheel };
}