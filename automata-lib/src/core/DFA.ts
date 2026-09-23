import { Automata } from "./Automata.js"
import { State } from "./State.js"
import type { Transition } from "./Transition.js"
import type { RunResult } from "./RunResult.js"
import type { Acceptor } from "./Acceptor.js"

export class DFA extends Automata implements Acceptor {

    private indexes: Map<number, Map<string | null, Transition>> | null = null;

    constructor(name: string | null = "s") {
        super(name);
    }


    override addTransition(transition: Transition): Transition | null {

        if (transition.symbol === null) return null;

        const alreadyExists = this.transitions.some(
            (t) => transition.from === t.from && transition.symbol === t.symbol
        );

        if (alreadyExists) return null;

        const result = super.addTransition(transition);

        if (result !== null) this.indexes = null;

        return result;
    }

    override removeTransition(transitionOrId: Transition | number): boolean {
        const removed = super.removeTransition(transitionOrId);

        if (removed) this.indexes = null;

        return removed;
    }

    override removeState(id: number): boolean {
        const removed = super.removeState(id);

        if (removed) this.indexes = null;

        return removed;
    }


    getTransitionFor(currentId: number, symbol: string): Transition | null {

        if (this.indexes === null) this.buildIndexes();

        const symbolTransitions = this.indexes?.get(currentId);
        const transition = symbolTransitions?.get(symbol) ?? null;

        return transition;

    }

    nextState(currentId: number, symbol: string): State | null {

        const transition = this.getTransitionFor(currentId, symbol);

        if (transition === null) return null;

        const state = this.states.find((s) => s.getId() === transition.to);

        if (state === undefined) return null;

        return state;

    }

    buildIndexes(): void {

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

    override run(input: string): RunResult {
        if (this.indexes === null) this.buildIndexes();

        const transitions: Transition[][] = [];
        let currentStateId: number = this.startStateId;

        for (const symbol of input) {
            const symbolTransitions = this.indexes?.get(currentStateId);
            const transition = symbolTransitions?.get(symbol) ?? null;

            if (transition === null) {
                return {
                    transitions,
                    finalStateIds: [],
                    completed: false,
                    accepted: false,
                };
            }

            transitions.push([transition]);
            currentStateId = transition.to;
        }

        const accepted = this.getState(currentStateId)?.getAcceptance() ?? false;

        return {
            transitions,
            finalStateIds: [currentStateId],
            completed: true,
            accepted,
        };
    }

    accepts(input: string): boolean {
        const result = this.run(input);

        return result.accepted;
    }
}