import { useRef } from "react";
import { AutomataLayout } from "../../../automata-visualizer/src/AutomataLayout.js";
import { buildSampleAutomata } from "../data/sampleAutomata";
import StateNode from "./StateNode";
import TransitionEdge from "./TransitionEdge";

function AutomataView() {
    const automataRef = useRef(buildSampleAutomata());
    const layoutRef = useRef(new AutomataLayout(automataRef.current));

    const startStateId = automataRef.current.getStartStateId();

    return (
        <>
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="black" />
                </marker>
            </defs>
            {layoutRef.current.getEdgeGeometries().map((geom, i) => (
                <TransitionEdge key={i} geometry={geom} />
            ))}
            {automataRef.current.getStates().map(state => {
                const pos = layoutRef.current.getPosition(state.getId());
                const name = automataRef.current.getStateName(state.getId());

                if (name === undefined || !pos) return null;

                return (
                    <StateNode
                        key={state.getId()}
                        position={pos}
                        name={name}
                        isAccepting={state.getAcceptance()}
                        isStart={state.getId() === startStateId}
                    />
                );
            })}
        </>
    );
}

export default AutomataView;