import { Automata } from "./Automata.js"
import { State } from "./State.js"
import type { Transition } from "./Transitions/Transition.js"

export class DFA extends Automata {

    constructor(name : string | null = "s"){

        super(name);

    }
}