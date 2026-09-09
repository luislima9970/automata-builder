export interface SerializedState {
    id: number;
    name: string;
    isAccepting: boolean;
}

export interface SerializedTransition {
    id: number;
    from: number;
    to: number;
    symbol: string | null;
}

export interface SerializedAutomata {
    version: 1;
    type: "NFA" | "DFA";
    startStateId: number;
    states: SerializedState[];
    transitions: SerializedTransition[];
}
