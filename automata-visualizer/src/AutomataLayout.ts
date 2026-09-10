import type { Automata } from '../../automata-lib/src/core/Automata.js';
import type { Transition } from '../../automata-lib/src/core/Transition.js';
import type { Position } from './Position.js';
import type { EdgeGeometry } from './EdgeGeometry.js';
import type { VisualTransition } from './VisualTransition.js'
import {edgePath, edgeLabelPosition, selfLoopPath, selfLoopLabelPosition } from "./edgePath.js";

export class AutomataLayout {
    private readonly automata: Automata;

    private readonly positions = new Map<number, Position>();

    private readonly visualTransitions = new Map<string, VisualTransition>();


    constructor(automata: Automata) {
        this.automata = automata;
        this.sync();
    }

    sync() : void {

        this.syncPositions();
        this.syncVisualTransitions();

    }

    private syncPositions(): void {
        const states = this.automata.getStates();
        const validStateIds = new Set(states.map((state) => state.getId()));

        for (const stateId of this.positions.keys()) {
            if (!validStateIds.has(stateId)) {
                this.positions.delete(stateId);
            }
        }

        for (const [index, state] of states.entries()) {
            if (!this.positions.has(state.getId())) {
                this.positions.set(
                    state.getId(),
                    this.createPosition(index)
                );
            }
        }
    }

    private createPosition(index: number): Position {
        return {
            x: 150 + index * 180,
            y: 200
        };
    }

    
    private syncVisualTransitions(): void {
        const nextVisualTransitions = new Map<string, VisualTransition>();

        for (const transition of this.automata.getTransitions()) {
            const key = this.edgeKey(transition.from, transition.to);
            const group = nextVisualTransitions.get(key);

            if (group !== undefined) {
                group.transitions.push(transition);
                continue;
            }

            const previousGroup = this.visualTransitions.get(key);

            nextVisualTransitions.set(key, {
                transitions: [transition],
                curvature: previousGroup?.curvature ?? 0
            });
        }

        this.visualTransitions.clear();

        for (const [key, visualTransition] of nextVisualTransitions) {
            this.visualTransitions.set(key, visualTransition);
        }
    }

    private edgeKey(fromId: number, toId : number): string {
        return `${fromId}:${toId}`;
    }
    setCurvature(fromId: number, toId: number, curvature: number): boolean {
        const key = this.edgeKey(fromId, toId);
        const visualTransition = this.visualTransitions.get(key);

        if (visualTransition === undefined) return false;

        visualTransition.curvature = curvature;
        return true;
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


    getEdgeGeometries(): EdgeGeometry[] {
        const ans: EdgeGeometry[] = [];

        for (const visualTransition of this.visualTransitions.values()) {
            const firstTransition: Transition = visualTransition.transitions[0];

            const fromId: number = firstTransition.from;
            const toId: number = firstTransition.to;

            const labels: string[] = [];

            for (const transition of visualTransition.transitions) {
                labels.push(transition.symbol === null ? "ε" : transition.symbol);
            }

            const label: string = [...new Set(labels)].join(", ");

            ans.push(this.createEdgeGeometry(fromId, toId, label, visualTransition.curvature));
        }

        return ans;
    }

    
    private createEdgeGeometry(fromId : number, toId : number,label : string, curvature : number = 0, stateRadius : number = 30) : EdgeGeometry {

        const from : Position | undefined = this.positions.get(fromId);
        const to : Position | undefined = this.positions.get(toId);

        if (from === undefined || to === undefined) {
        throw new Error(`Missing position for edge ${fromId} -> ${toId}`);
        }   


        if (fromId === toId) return {
            path: selfLoopPath(from,stateRadius),
            labelPosition: selfLoopLabelPosition(from,stateRadius),
            label: label 
        };

        return {
            path: edgePath(from,to,curvature),
            labelPosition: edgeLabelPosition(from,to,curvature),
            label: label
        };

    }
}