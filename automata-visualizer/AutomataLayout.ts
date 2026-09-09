import type { Automata } from '../automata-lib/src/core/Automata.js';
import type { Position } from './Position.js';


export class AutomataVisualizer {
    private readonly automata: Automata;
    private readonly positions = new Map<number, Position>();

    constructor(automata: Automata) {
        this.automata = automata;
        this.createInitialPositions();
    }

    private createInitialPositions(): void {
        for (const [index, state] of this.automata.getStates().entries()) {
            this.positions.set(state.getId(), {
                x: 150 + index * 180,
                y: 200
            });
        }
    }

    getAutomata(): Automata {
        return this.automata;
    }

    getPosition(stateId: number): Position | undefined {
        return this.positions.get(stateId);
    }

    setPosition(stateId: number, position: Position): boolean {
        if (this.automata.getState(stateId) === null) return false;

        this.positions.set(stateId, position);
        return true;
    }

    removeState(stateId: number): void {
        this.positions.delete(stateId)
    }
}