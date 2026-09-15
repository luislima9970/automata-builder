import type { Automata } from "../../../automata-lib/src/core/Automata.js";
import type { AutomataLayout } from "../../../automata-visualizer/src/AutomataLayout.js";
import StateNode from "./StateNode";
import TransitionEdge from "./TransitionEdge";

interface Props {
    automata: Automata;
    layout: AutomataLayout;
    onNodeMouseDown: (stateId: number) => void;
}

function AutomataView({ automata, layout, onNodeMouseDown }: Props) {
    const startStateId = automata.getStartStateId();

    return (
        <>
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="black" />
                </marker>
            </defs>
            {layout.getEdgeGeometries().map((geom, i) => (
                <TransitionEdge key={i} geometry={geom} />
            ))}
            {automata.getStates().map(state => {
                const pos = layout.getPosition(state.getId());
                const name = automata.getStateName(state.getId());
                if (name === undefined || !pos) return null;

                return (
                    <StateNode
                        key={state.getId()}
                        position={pos}
                        name={name}
                        isAccepting={state.getAcceptance()}
                        isStart={state.getId() === startStateId}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            onNodeMouseDown(state.getId());
                        }}
                    />
                );
            })}
        </>
    );
}

export default AutomataView;