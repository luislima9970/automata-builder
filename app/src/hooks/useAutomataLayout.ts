import { useRef, useReducer } from "react";
import { AutomataLayout } from "../../../automata-visualizer/src/AutomataLayout.js";
import { buildSampleAutomata } from "../data/sampleAutomata";
import type { Automata } from "../../../automata-lib/src/core/Automata.js";

export function useAutomataLayout() {
    const automataRef = useRef<Automata>(buildSampleAutomata());
    const layoutRef = useRef(new AutomataLayout(automataRef.current));
    const [, forceRender] = useReducer(x => x + 1, 0);

    function moveState(stateId: number, dx: number, dy: number) {
        const current = layoutRef.current.getPosition(stateId);
        if (!current) return;

        layoutRef.current.setPosition(stateId, { x: current.x + dx, y: current.y + dy });
        forceRender();
    }

    return {
        automata: automataRef.current,
        layout: layoutRef.current,
        moveState,
    };
}