import type { Transition } from "./Transition.js"

export interface DFARunResult {
    transitions: Transition[];
    finalStateId: number | null;
    completed: boolean;
}

export interface NFARunResult {
    transitions: Transition[][];
    finalStateIds: number[];
    completed: boolean;
}