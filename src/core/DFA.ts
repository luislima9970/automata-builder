import { Automata } from "./Automata.js"
import { State } from "./State.js"
import type { Transition } from "./Transition.js"
import type { DFARunResult } from "./DFARunResult.js"
import type { Acceptor } from "./Acceptor.js"

export class DFA extends Automata implements Acceptor {

    private indexes : Map<number, Map<string | null, Transition>> | null = null;

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

    getTransitionFor(currentId : number,symbol : string) : Transition | null {

        const transition = this.transitions.find(t => t.from === currentId && t.symbol === symbol);

        if (transition === undefined) return null;

        return transition;


    }

    nextState(currentId : number,symbol : string) : State | null{

        const transition = this.getTransitionFor(currentId,symbol);

        if (transition === null) return null;

        const state = this.states.find((s) => s.getId() === transition.to);

        if (state === undefined) return null;

        return state;

    }

    buildIndexes() : void {

        if (this.indexes !== null) return;

        this.indexes = new Map();

        for (const transition of this.transitions) {
            const fromMap = this.indexes.get(transition.from);

            if (fromMap === undefined) {
                this.indexes.set(transition.from, new Map<string | null, Transition>());
            }

            const symbolsMap = this.indexes.get(transition.from)!;
            symbolsMap.set(transition.symbol ?? "", transition);
        }

    }

    run(input: string) : DFARunResult {

        if (this.indexes === null) this.buildIndexes();

        const transitions: Transition[] = [];

        let currentStateId: number = this.startStateId;

        for (const symbol of input) {
            const symbolTransitions = this.indexes?.get(currentStateId);
            const transition = symbolTransitions?.get(symbol) ?? null;

            if (transition === null) return {
                transitions,
                finalStateId : null,
                completed : false
            };

            transitions.push(transition);
            currentStateId = transition.to;
        }

        return {
            transitions,
            finalStateId : currentStateId,
            completed : true
        };
    }

    accepts(input: string) : boolean {
        const result = this.run(input);

        if (!result.completed || result.finalStateId === null) return false;

        const finalState = this.states.find((state) => state.getId() === result.finalStateId);
        return finalState !== undefined && finalState.getAcceptance();
    }
}