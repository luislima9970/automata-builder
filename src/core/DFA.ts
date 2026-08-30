import { Automata } from "./Automata.js"
import { State } from "./State.js"
import type { Transition } from "./Transition.js"

export class DFA extends Automata {

    constructor(name : string | null = "s"){
        super(name);
    }

    override addTransition(transition : Transition) : Transition | null {

        const alreadyExists = this.transitions.some(
            (t) => transition.from === t.from && transition.symbol === t.symbol
        );

        if (alreadyExists) return null;

        return super.addTransition(transition);
    }

    

}