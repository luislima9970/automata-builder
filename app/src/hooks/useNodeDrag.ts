import { useRef } from "react";

export function useNodeDrag(onMove: (stateId: number, dx: number, dy: number) => void) {
    const draggingStateId = useRef<number | null>(null);

    function startDrag(stateId: number) {
        draggingStateId.current = stateId;
    }

    function handleDragMove(e: React.MouseEvent): boolean {
        if (draggingStateId.current === null) return false;
        onMove(draggingStateId.current, e.movementX, e.movementY);
        return true;
    }

    function endDrag() {
        draggingStateId.current = null;
    }

    return { startDrag, handleDragMove, endDrag };
}
