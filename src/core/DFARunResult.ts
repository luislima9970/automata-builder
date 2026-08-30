import type { Transition } from "./Transition.js"

export interface DFARunResult {
    transitions: Transition[];
    finalStateId: number | null;
    completed: boolean;
}
