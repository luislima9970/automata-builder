import type { SerializedAutomata } from "../../../automata-lib/src/serializers/SerializedAutomata";

export interface EditorSnapshot {
    automata: SerializedAutomata;

    positions: {
        stateId: number;
        x: number;
        y: number;
    }[];

    curvatures: {
        fromId: number;
        toId: number;
        curvature: number;
    }[];
}

