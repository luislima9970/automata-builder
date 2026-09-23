import { Automata } from "./Automata.js"
import { State } from "./State.js"
import type { Transition } from "./Transition.js"
import type { Acceptor } from "./Acceptor.js"
import type { RunResult } from "./RunResult.js"



export class NFA extends Automata implements Acceptor {

    private indexes: Map<number, Map<string | null, Transition[]>> | null = null;

    override addTransition(transition: Transition): Transition | null {
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

    epsilonClosure(stateIds: number[]): number[] {

        if (this.indexes === null) this.buildIndexes();

        const closure: Set<number> = new Set();
        const stack: number[] = [...stateIds];

        while (stack.length > 0) {
            const state: number | undefined = stack.pop();
            if (state === undefined) continue;
            if (closure.has(state)) continue;

            closure.add(state);

            const m: Map<string | null, Transition[]> | undefined = this.indexes?.get(state)

            if (m === undefined) continue;

            const nextStates: number[] = m?.get(null)?.map((t) => t.to) ?? [];

            for (const next of nextStates) {
                if (closure.has(next) === false) {
                    stack.push(next);
                }
            }
        }

        return [...closure];

    }

    getTransitionsFor(currentIds: number[], symbol: string | null): Transition[] {
        if (this.indexes === null) this.buildIndexes();

        const ans: Transition[] = [];

        for (const id of currentIds) {
            const m = this.indexes?.get(id);
            const transitions = m?.get(symbol) ?? [];
            ans.push(...transitions);
        }

        return ans;
    }

    nextStates(currentIds: number[], symbol: string | null): number[] {
        const transitions = this.getTransitionsFor(currentIds, symbol);
        return [...new Set(transitions.map((t) => t.to))];
    }

    buildIndexes(): void {

        if (this.indexes !== null) return;

        this.indexes = new Map();

        for (const transition of this.transitions) {

            if (this.indexes.has(transition.from) === false) this.indexes.set(transition.from, new Map());

            const symbolTransitions = this.indexes.get(transition.from)!;

            if (symbolTransitions.has(transition.symbol) === false) symbolTransitions.set(transition.symbol, []);

            const transitions = symbolTransitions.get(transition.symbol)!;

            transitions.push(transition);


        }

    }

    run(input: string): RunResult {
        const start = this.getStartStateId();
        if (start === null) {
            return { transitions: [], finalStateIds: [], completed: false, accepted: false };
        }

        const startClosure = this.epsilonClosure([start]);
        let currentStates = startClosure.map((stateId) => ({
            stateId,
            path: [] as Transition[],
        }));

        for (const symbol of input) {
            const nextStates: Array<{ stateId: number; path: Transition[] }> = [];

            for (const current of currentStates) {
                const transitions = this.getTransitionsFor([current.stateId], symbol);

                for (const transition of transitions) {
                    const closure = this.epsilonClosure([transition.to]);

                    for (const stateId of closure) {
                        nextStates.push({
                            stateId,
                            path: [...current.path, transition],
                        });
                    }
                }
            }

            if (nextStates.length === 0) {
                return {
                    transitions: currentStates.map((s) => s.path),
                    finalStateIds: [],
                    completed: false,
                    accepted: false,
                };
            }

            const seen = new Set<number>();
            const dedupedNextStates: Array<{ stateId: number; path: Transition[] }> = [];
            for (const s of nextStates) {
                if (!seen.has(s.stateId)) {
                    seen.add(s.stateId);
                    dedupedNextStates.push(s);
                }
            }
            currentStates = dedupedNextStates;
        }

        const finalStateIds = currentStates.map((s) => s.stateId);
        const accepted = finalStateIds.some(
            (id) => this.getState(id)?.getAcceptance() ?? false
        );

        return {
            transitions: currentStates.map((s) => s.path),
            finalStateIds,
            completed: true,
            accepted,
        };
    }

    accepts(input: string): boolean {
        const result = this.run(input);

        return result.accepted;
    }

}