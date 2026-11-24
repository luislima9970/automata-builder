import { useRef, useReducer, useEffect } from "react";
import type { MouseEvent, WheelEvent } from "react";
import { Camera } from "../../../automata-visualizer/src/Camera.js";

interface Point {
    x: number;
    y: number;
}

export function useCamera(width: number, height: number) {
    const cameraRef = useRef(new Camera(0, 0, 1, width, height));
    const [, forceRender] = useReducer(x => x + 1, 0);

    useEffect(() => {
        cameraRef.current.resize(width, height);
        forceRender();
    }, [width, height]);

    function handleMouseMove(event: MouseEvent) {
        if (event.buttons === 1) {
            cameraRef.current.pan(event.movementX, event.movementY);
            forceRender();
        }
    }

    function handleWheel(event: WheelEvent) {
        const factor = event.deltaY < 0 ? 1.1 : 1 / 1.1;
        const rect = event.currentTarget.getBoundingClientRect();

        cameraRef.current.zoomAt(
            event.clientX - rect.left,
            event.clientY - rect.top,
            factor,
        );

        forceRender();
    }

    function zoomIn() {
        const camera = cameraRef.current;

        camera.zoomAt(
            camera.pixelWidth / 2,
            camera.pixelHeight / 2,
            1.2,
        );

        forceRender();
    }

    function zoomOut() {
        const camera = cameraRef.current;

        camera.zoomAt(
            camera.pixelWidth / 2,
            camera.pixelHeight / 2,
            1 / 1.2,
        );

        forceRender();
    }

    function fitToContent(points: Point[]) {
        const camera = cameraRef.current;

        if (points.length === 0) {
            camera.zoom = 1;
            camera.topLeft = { x: 0, y: 0 };
            forceRender();
            return;
        }

        const padding = 80;

        const minX = Math.min(...points.map(point => point.x)) - padding;
        const maxX = Math.max(...points.map(point => point.x)) + padding;
        const minY = Math.min(...points.map(point => point.y)) - padding;
        const maxY = Math.max(...points.map(point => point.y)) + padding;

        camera.zoom = Math.max(
            0.1,
            Math.min(
                camera.pixelWidth / (maxX - minX),
                camera.pixelHeight / (maxY - minY),
                2,
            ),
        )

        camera.topLeft = {
            x: (minX + maxX) / 2 - camera.pixelWidth / (2 * camera.zoom),
            y: (minY + maxY) / 2 - camera.pixelHeight / (2 * camera.zoom),
        };

        forceRender();
    }

    return {
        camera: cameraRef.current,
        handleMouseMove,
        handleWheel,
        zoomIn,
        zoomOut,
        fitToContent,
    };
}

