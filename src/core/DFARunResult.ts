import type { Transition } from "./Transition.js"


interface DFARunResult {
    transitions: Transition[];
    finalStateId: number | null;
    completed: boolean;
}
