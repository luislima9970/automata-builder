import type { SerializedAutomata } from "./SerializedAutomata.js";

export function validateSerializedAutomata(value: unknown): asserts value is SerializedAutomata {
    if (typeof value !== "object" || value === null) {
        throw new Error("Serialized automaton must be an object");
    }

    const data = value as Record<string, unknown>;

    if (data.version !== 1) {
        throw new Error("Unsupported or missing serialization version");
    }

    if (data.type !== "NFA" && data.type !== "DFA") {
        throw new Error('Automaton type must be "NFA" or "DFA"');
    }

    if (typeof data.name !== "string") {
        throw new Error("Automaton name must be a string");
    }

    if (!Number.isInteger(data.startStateId)) {
        throw new Error("Start-state ID must be an integer");
    }

    if (!Array.isArray(data.states)) {
        throw new Error("States must be an array");
    }

    if (!Array.isArray(data.transitions)) {
        throw new Error("Transitions must be an array");
    }

    const stateIds = new Set<number>();
    const stateNames = new Set<string>();

    for (const state of data.states) {
        if (typeof state !== "object" || state === null) {
            throw new Error("Every state must be an object");
        }

        const candidate = state as Record<string, unknown>;

        if (!Number.isInteger(candidate.id)) {
            throw new Error("Every state ID must be an integer");
        }

        if (typeof candidate.name !== "string") {
            throw new Error("Every state name must be a string");
        }

        if (typeof candidate.isAccepting !== "boolean") {
            throw new Error("Every state's isAccepting value must be boolean");
        }

        const id = candidate.id as number;
        const name = candidate.name;

        if (stateIds.has(id)) {
            throw new Error(`Duplicate state ID: ${id}`);
        }

        if (stateNames.has(name)) {
            throw new Error(`Duplicate state name: "${name}"`);
        }

        stateIds.add(id);
        stateNames.add(name);
    }

    const startStateId = data.startStateId as number;

    if (!stateIds.has(startStateId)) {
        throw new Error(`Start state ${startStateId} does not exist`);
    }

    const transitionIds = new Set<number>();
    const dfaTransitions = new Set<string>();

    for (const transition of data.transitions) {
        if (typeof transition !== "object" || transition === null) {
            throw new Error("Every transition must be an object");
        }

        const candidate = transition as Record<string, unknown>;

        if (!Number.isInteger(candidate.id)) {
            throw new Error("Every transition ID must be an integer");
        }

        if (!Number.isInteger(candidate.from) || !Number.isInteger(candidate.to)) {
            throw new Error("Transition endpoints must be integer state IDs");
        }

        if (candidate.symbol !== null && typeof candidate.symbol !== "string") {
            throw new Error("Transition symbol must be a string or null");
        }

        const id = candidate.id as number;
        const from = candidate.from as number;
        const to = candidate.to as number;
        const symbol = candidate.symbol as string | null;

        if (transitionIds.has(id)) {
            throw new Error(`Duplicate transition ID: ${id}`);
        }

        if (!stateIds.has(from)) {
            throw new Error(`Transition ${id} has nonexistent source state ${from}`);
        }

        if (!stateIds.has(to)) {
            throw new Error(`Transition ${id} has nonexistent destination state ${to}`);
        }

        transitionIds.add(id);

        if (data.type === "DFA") {
            if (symbol === null) {
                throw new Error("A DFA cannot contain epsilon transitions");
            }

            const deterministicKey = JSON.stringify([from, symbol]);

            if (dfaTransitions.has(deterministicKey)) {
                throw new Error(
                    `DFA has multiple transitions from state ${from} using symbol "${symbol}"`
                );
            }

            dfaTransitions.add(deterministicKey);
        }
    }
}
