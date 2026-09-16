import { useRef } from "react";

export function useNodeDrag(zoom: number,onMove: (stateId: number, dx: number, dy: number) => void) {
    const draggingStateId = useRef<number | null>(null);

    function startDrag(stateId: number) {
        draggingStateId.current = stateId;
    }

    function handleDragMove(e: React.MouseEvent): boolean {
        if (draggingStateId.current === null) return false;

        const worldDx = e.movementX / zoom;
        const worldDy = e.movementY / zoom;

        onMove(draggingStateId.current, worldDx, worldDy);

        return true;
    }

    function endDrag() {
        draggingStateId.current = null;
    }

    return { startDrag, handleDragMove, endDrag };
}
