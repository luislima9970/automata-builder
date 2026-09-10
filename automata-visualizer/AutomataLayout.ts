import type { Automata } from '../automata-lib/src/core/Automata.js';
import type { Transition } from '../automata-lib/src/core/Transition.js';
import type { Position } from './Position.js';
import type { EdgeGeometry } from './EdgeGeometry.js';
import type { VisualTransition } from './VisualTransition.js'
import {edgePath, edgeLabelPosition, selfLoopPath, selfLoopLabelPosition } from "./edgePath.js";

export class AutomataLayout {
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

    getEdgeGeometries() : EdgeGeometry[]{

        const visualTransitions : VisualTransition[] = this.createVisualTransitions();

        const ans : EdgeGeometry[] = [];

        for (const vtransition of visualTransitions){

            const t0 : Transition  = vtransition.transitions[0];

            const fromId : number = t0.from;
            const toId : number = t0.to;

            const labels : string[] = [];

            for (const t of vtransition.transitions) labels.push((t.symbol === null ? 'ε' : t.symbol));

            const label : string = [...new Set(labels)].join(", ");

            ans.push(this.createEdgeGeometry(fromId,toId,label));

        }

        return ans;

    } 

    private createVisualTransitions(): VisualTransition[] {
        const transitions = new Map<string, VisualTransition>();

        for (const transition of this.automata.getTransitions()) {

            const key = `${transition.from}:${transition.to}`;
            const visualTransition = transitions.get(key);

            if (visualTransition === undefined) {
                transitions.set(key, {
                    transitions: [transition]
                });

                continue;
            }

            visualTransition.transitions.push(transition);
            
        }

        return [...transitions.values()];
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