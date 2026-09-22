import { useRef } from "react";

export function useEdgeDraw(onComplete: (fromId: number, toId: number,symbol : string | null) => void) {
    const fromStateId = useRef<number | null>(null);

    function handleStateClick(stateId: number,symbol : string | null): boolean {
        if (fromStateId.current === null) {
            fromStateId.current = stateId;
            return true; 
        }

        onComplete(fromStateId.current, stateId,symbol);
        fromStateId.current = null;
        return true; 
    }

    function cancel() {
        fromStateId.current = null;
    }

    return {
        pendingFromId: fromStateId.current,
        handleStateClick,
        cancel,
    };
}