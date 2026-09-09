import { DFA } from "../core/DFA.js";
import { NFA } from "../core/NFA.js";
import type { SerializedAutomata, SerializedState, SerializedTransition } from "./SerializedAutomata.js";
import { validateSerializedAutomata } from "./validateSerializedAutomata.js";

export class AutomataSerializer {
    static serialize(automata: NFA | DFA): string {
        return JSON.stringify(this.toObject(automata), null, 2);
    }

    static toObject(automata: NFA | DFA): SerializedAutomata {
        const type: "NFA" | "DFA" = automata instanceof DFA ? "DFA" : "NFA";

        const states: SerializedState[] = automata.getStates().map((state) => {
            const name = automata.getName(state.getId());

            if (name === undefined) {
                throw new Error(`State ${state.getId()} has no name`);
            }

            return {
                id: state.getId(),
                name,
                isAccepting: state.getAcceptance()
            };
        });

        const transitions: SerializedTransition[] = automata.getTransitions().map((transition) => {
            if (transition.id === undefined) {
                throw new Error("Cannot serialize a transition without an ID");
            }

            return {
                id: transition.id,
                from: transition.from,
                to: transition.to,
                symbol: transition.symbol
            };
        });

        return {
            version: 1,
            type,
            name: automata.getAutomataName(),
            startStateId: automata.getStartStateId(),
            states,
            transitions
        };
    }

    static deserialize(json: string): NFA | DFA {
        let value: unknown;

        try {
            value = JSON.parse(json);
        } catch {
            throw new Error("Invalid JSON syntax");
        }

        return this.fromObject(value);
    }

    static fromObject(value: unknown): NFA | DFA {
        validateSerializedAutomata(value);

        return this.createAutomata(value);
    }

    private static createAutomata(data: SerializedAutomata): NFA | DFA {
        const firstState = data.states[0];

        if (firstState === undefined) {
            throw new Error("An automaton must contain at least one state");
        }

        const automata: NFA | DFA = data.type === "NFA"
            ? new NFA(firstState.name)
            : new DFA(firstState.name);

        automata.setName(data.name);

        const idMap = new Map<number, number>();

        idMap.set(firstState.id, 0);

        if (firstState.isAccepting) {
            automata.setStateAcceptance(0);
        }

        for (const serializedState of data.states.slice(1)) {
            const state = automata.addState(serializedState.name);

            if (state === null) {
                throw new Error(`Could not restore state "${serializedState.name}"`);
            }

            idMap.set(serializedState.id, state.getId());

            if (serializedState.isAccepting) {
                automata.setStateAcceptance(state.getId());
            }
        }

        const restoredStartId = idMap.get(data.startStateId);

        if (restoredStartId === undefined) {
            throw new Error(`Could not restore start state ${data.startStateId}`);
        }

        automata.setStartState(restoredStartId);

        for (const serializedTransition of data.transitions) {
            const from = idMap.get(serializedTransition.from);
            const to = idMap.get(serializedTransition.to);

            if (from === undefined || to === undefined) {
                throw new Error(`Could not restore transition ${serializedTransition.id}`);
            }

            const transition = automata.addTransition({
                id: serializedTransition.id,
                from,
                to,
                symbol: serializedTransition.symbol
            });

            if (transition === null) {
                throw new Error(`Could not restore transition ${serializedTransition.id}`);
            }
        }

        return automata;
    }
}
