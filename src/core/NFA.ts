import { Automata } from "./Automata.js"
import { State } from "./State.js"
import type { Transition } from "./Transition.js"
import type { DFARunResult } from "./RunResult.js"
import type { Acceptor } from "./Acceptor.js"
import type { NFARunResult } from "./RunResult.js"



export class NFA extends Automata implements Acceptor {

    private indexes : Map<number, Map<string | null, Transition[]>> | null = null;

    override addTransition(transition : Transition) : Transition | null {
        const result = super.addTransition(transition);

        if (result !== null) this.indexes = null;

        return result;
    }

    override removeTransition(transitionOrId : Transition | number) : boolean {
        const removed = super.removeTransition(transitionOrId);

        if (removed) this.indexes = null;

        return removed;
    }

    override removeState(id : number) : boolean {
        const removed = super.removeState(id);

        if (removed) this.indexes = null;

        return removed;
    }

    epsilonClosure(stateIds: number[]): number[] {

        if (this.indexes === null) this.buildIndexes();

        const closure : Set<number> = new Set(stateIds);

        const stack : number[] = [...stateIds];


        while (stack.length > 0){

            const state : number | undefined = stack.at(-1);
            stack.pop();
            if (state === undefined) continue;
            if (closure.has(state)) continue;

            const m : Map<string | null, Transition[]> | undefined = this.indexes?.get(state)

            if (m === undefined) continue;

            const nextStates : number[] = m?.get(null)?.map((t) => t.to) ?? [];

            for (const next of nextStates){
                if (closure.has(next) === false){
                    closure.add(next);
                    stack.push(next);
                }
            }


        }

        return [...closure];

    }

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

    run(input: string) : NFARunResult {
        
    }


}