import type { Automata } from '../../automata-lib/src/core/Automata.js';
import type { Transition } from '../../automata-lib/src/core/Transition.js';
import type { Position } from './Position.js';
import type { EdgeGeometry } from './EdgeGeometry.js';
import type { VisualTransition } from './VisualTransition.js'
import { edgePath, edgeLabelPosition, selfLoopPath, selfLoopLabelPosition } from "./edgePath.js";
import dagre, { Edge } from "@dagrejs/dagre";
import { State } from 'automata-lib/src/core/State.js';
import type { EdgeRender } from './EdgeRender.js'

export class AutomataLayout {
    private readonly automata: Automata;

    private readonly positions = new Map<number, Position>();

    private readonly visualTransitions = new Map<string, VisualTransition>();


    constructor(automata: Automata) {
        this.automata = automata;
        this.sync();
    }

    sync(): void {

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

        const newStates = states.filter((state) => !this.positions.has(state.getId()));
        if (newStates.length === 0) return;

        const computedPositions = this.computeDagreLayout(states);

        for (const state of newStates) {
            const pos = computedPositions.get(state.getId());
            if (pos !== undefined) {
                this.positions.set(state.getId(), pos);
            }
        }
    }

    private computeDagreLayout(states: State[]): Map<number, Position> {
        const g = new dagre.graphlib.Graph();
        g.setDefaultEdgeLabel(() => ({}));
        g.setGraph({ rankdir: "LR", nodesep: 60, ranksep: 100, marginx: 120, marginy: 120 });

        for (const state of states) {
            g.setNode(String(state.getId()), { width: 60, height: 60 });
        }

        for (const transition of this.automata.getTransitions()) {
            if (transition.from !== transition.to) {
                g.setEdge(String(transition.from), String(transition.to));
            }
        }

        dagre.layout(g);

        const positions = new Map<number, Position>();
        const orderedStates = [...states].sort((left, right) => left.getId() - right.getId());

        if (orderedStates.length <= 2) {
            const defaultPositions = [
                { x: 150, y: 200 },
                { x: 330, y: 200 }
            ];

            for (const [index, state] of orderedStates.entries()) {
                positions.set(state.getId(), defaultPositions[index] ?? { x: 150 + index * 180, y: 200 });
            }

            return positions;
        }

        const positionedNodes = orderedStates.map((state) => ({
            state,
            node: g.node(String(state.getId()))
        }));

        const minX = Math.min(...positionedNodes.map(({ node }) => node.x));
        const maxX = Math.max(...positionedNodes.map(({ node }) => node.x));
        const minY = Math.min(...positionedNodes.map(({ node }) => node.y));
        const maxY = Math.max(...positionedNodes.map(({ node }) => node.y));

        const translationX = 150 - (minX + (maxX - minX) / 2);
        const translationY = 200 - (minY + (maxY - minY) / 2);

        for (const { state, node } of positionedNodes) {
            positions.set(state.getId(), {
                x: node.x + translationX,
                y: node.y + translationY
            });
        }

        return positions;
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

    private edgeKey(fromId: number, toId: number): string {
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


    getEdgeRenders(): EdgeRender[] {
        const ans: EdgeRender[] = [];

        this.addCurvatures();

        for (const visualTransition of this.visualTransitions.values()) {
            const firstTransition: Transition = visualTransition.transitions[0];

            const fromId: number = firstTransition.from;
            const toId: number = firstTransition.to;

            const labels: string[] = [];

            for (const transition of visualTransition.transitions) {
                labels.push(transition.symbol === null ? "ε" : transition.symbol);
            }

            const label: string = [...new Set(labels)].join(", ");

            ans.push({fromId: fromId,toId: toId, geometry: this.createEdgeGeometry(fromId, toId, label, visualTransition.curvature)});
        }


        return ans;
    }

    getEdgeGeometries() : EdgeGeometry[]{

        const ans : EdgeGeometry[] = [];

        this.getEdgeRenders().map((render) => {
            ans.push(render.geometry);
        })

        return ans;

    }

    private addCurvatures() {

        const visited: Set<string> = new Set();

        for (const visualTransition of this.visualTransitions.values()) {

            const from: number = visualTransition.transitions[0].from;
            const to: number = visualTransition.transitions[0].to;

            if (visited.has(this.edgeKey(to, from))) {
                if (visualTransition.curvature === 0)
                    visualTransition.curvature = 40;
                const vt: VisualTransition | undefined = this.visualTransitions.get(this.edgeKey(to, from));

                if (vt === undefined) return;

                if (vt.curvature === 0)
                    vt.curvature = 40;
            }

            visited.add(this.edgeKey(from, to));

        }
    }


    private createEdgeGeometry(fromId: number, toId: number, label: string, curvature: number = 0, stateRadius: number = 30): EdgeGeometry {

        const from: Position | undefined = this.positions.get(fromId);
        const to: Position | undefined = this.positions.get(toId);

        if (from === undefined || to === undefined) {
            throw new Error(`Missing position for edge ${fromId} -> ${toId}`);
        }


        if (fromId === toId) return {
            path: selfLoopPath(from, stateRadius),
            labelPosition: selfLoopLabelPosition(from, stateRadius),
            label: label
        };

        return {
            path: edgePath(from, to, curvature, stateRadius),
            labelPosition: edgeLabelPosition(from, to, curvature, stateRadius),
            label: label
        };

    }
}