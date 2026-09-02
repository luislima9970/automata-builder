import { Automata } from "./Automata.js"
import { State } from "./State.js"
import type { Transition } from "./Transition.js"
import type { DFARunResult } from "./DFARunResult.js"
import type { Acceptor } from "./Acceptor.js"




export class NFA extends Automata implements Acceptor {

    private indexes : Map<number, Map<string | null, Transition[]>> | null = null;

    getTransitionsFor(currentIds: number[],symbol : string | null) : Transition[]{
        if (this.indexes === null) this.buildIndexes();

        const ans : Transition[] = [];

        for (const id of currentIds){
            const m = this.indexes?.get(id);
            const transitions = m?.get(symbol) ?? [];
            ans.push(...transitions);
        }

        return ans;
    }

    nextStates(currentIds: number[], symbol: string | null) : number[] {
        const transitions = this.getTransitionsFor(currentIds, symbol);
        return [...new Set(transitions.map((t) => t.to))];
    }

    buildIndexes() : void {

        if (this.indexes !== null) return;

        this.indexes = new Map();

        for (const transition of this.transitions) {

            if (this.indexes.has(transition.from) === false) this.indexes.set(transition.from,new Map());

            const symbolTransitions = this.indexes.get(transition.from)!;

            if (symbolTransitions.has(transition.symbol) === false) symbolTransitions.set(transition.symbol,[]);

            const transitions = symbolTransitions.get(transition.symbol)!;

            transitions.push(transition);


        }

    }


}