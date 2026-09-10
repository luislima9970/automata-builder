import type { Transition } from './../automata-lib/src/core/Transition.js';

export interface VisualTransition {
    transitions : [Transition, ...Transition[]];
}