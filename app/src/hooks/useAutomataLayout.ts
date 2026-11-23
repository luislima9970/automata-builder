import { useRef, useReducer } from "react";
import { AutomataLayout } from "../../../automata-visualizer/src/AutomataLayout.js";
import { AutomataSerializer } from "../../../automata-lib/src/serializers/AutomataSerializer.js";
import { buildSampleAutomata } from "../data/sampleAutomata";
import type { Automata } from "../../../automata-lib/src/core/Automata.js";
import type { EditorSnapshot } from "../history/EditorSnapshot.js";

export function useAutomataLayout() {
    const automataRef = useRef<Automata>(buildSampleAutomata());
    const layoutRef = useRef(new AutomataLayout(automataRef.current));
    const [, forceRender] = useReducer(x => x + 1, 0);

    function moveState(stateId: number, dx: number, dy: number) {
        const current = layoutRef.current.getPosition(stateId);
        if (!current) return;

        layoutRef.current.setPosition(stateId, {
            x: current.x + dx,
            y: current.y + dy,
        });

        forceRender();
    }

    function replaceAutomata(nextAutomata: Automata) {
        const nextLayout = new AutomataLayout(nextAutomata);

        automataRef.current = nextAutomata;
        layoutRef.current = nextLayout;

        forceRender();
    }

    function captureSnapshot(): EditorSnapshot {
        const automata = automataRef.current;
        const layout = layoutRef.current;

        return structuredClone({
            automata: AutomataSerializer.toObject(automata),

            positions: automata.getStates().flatMap(state => {
                const position = layout.getPosition(state.getId());

                return position
                    ? [{
                        stateId: state.getId(),
                        x: position.x,
                        y: position.y,
                    }]
                    : [];
            }),

            curvatures: layout.getCurvatures(),
        });
    }

    function restoreSnapshot(snapshot: EditorSnapshot) {
        const restored = AutomataSerializer.fromObject(snapshot.automata);
        const restoredLayout = new AutomataLayout(restored);

        const idsByName = new Map<string, number>();

        for (const state of restored.getStates()) {
            const name = restored.getStateName(state.getId());

            if (name !== undefined) {
                idsByName.set(name, state.getId());
            }
        }

        const idMap = new Map<number, number>();

        for (const state of snapshot.automata.states) {
            const restoredId = idsByName.get(state.name);

            if (restoredId === undefined) {
                throw new Error(`Unable to restore state ${state.name}`);
            }

            idMap.set(state.id, restoredId);
        }

        for (const position of snapshot.positions) {
            const restoredId = idMap.get(position.stateId);

            if (restoredId !== undefined) {
                restoredLayout.setPosition(restoredId, {
                    x: position.x,
                    y: position.y,
                });
            }
        }

        for (const edge of snapshot.curvatures) {
            const fromId = idMap.get(edge.fromId);
            const toId = idMap.get(edge.toId);

            if (fromId !== undefined && toId !== undefined) {
                restoredLayout.setCurvature(
                    fromId,
                    toId,
                    edge.curvature,
                );
            }
        }

        automataRef.current = restored;
        layoutRef.current = restoredLayout;

        forceRender();
    }

    return {
        automata: automataRef.current,
        layout: layoutRef.current,
        moveState,
        replaceAutomata,
        captureSnapshot,
        restoreSnapshot,
    };
}

