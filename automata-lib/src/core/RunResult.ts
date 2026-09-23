import type { Transition } from "./Transition.js";

export interface RunResult {
  transitions: Transition[][];
  finalStateIds: number[];
  completed: boolean;
  accepted : boolean;
}

