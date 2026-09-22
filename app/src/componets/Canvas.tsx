import AutomataView from "./AutomataView"
import { useCamera } from "../hooks/useCamera";
import { useAutomataLayout } from "../hooks/useAutomataLayout";
import { useNodeDrag } from "../hooks/useNodeDrag";
import type { Tool } from "../data/Tool.js"
import { State } from "automata-lib/src/core/State.js";
import { Position } from "../../../automata-visualizer/src/Position.js";
import { useEdgeDraw } from "../hooks/useEdgeDraw.js";
import { useEffect, useReducer } from "react";
import { Transition } from "automata-lib/src/core/Transition.js";


interface Props {
  width: number;
  height: number;
  selectedTool: Tool;
}

function Canvas({ width, height, selectedTool }: Props) {
  const { camera, handleMouseMove: handleCameraMove, handleWheel } = useCamera(width, height);
  const { automata, layout, moveState } = useAutomataLayout();
  const { startDrag, handleDragMove, endDrag } = useNodeDrag(camera.zoom, moveState);
  const [, forceRender] = useReducer((value: number) => value + 1, 0);
  const { pendingFromId, handleStateClick, cancel } = useEdgeDraw((fromId, toId) => {
    const t: Transition = { from: fromId, to: toId, symbol: null };
    automata.addTransition(t);
    layout.sync();
  });

  useEffect(() =>{

    cancel();
    forceRender();
  },[selectedTool])

  function handleMouseMove(e: React.MouseEvent) {
    const wasDragging = handleDragMove(e);
    if (!wasDragging) handleCameraMove(e);
  }

  function removeState(stateId: number): void {
    automata.removeState(stateId);
    layout.sync();
  }

  function toggleAcceptanceState(stateId: number) {

    automata.getState(stateId)?.toggleAcceptance();
    layout.sync();
  }

  function removeEdge(fromId: number, toId: number): void {

    automata.getTransitions().map((t) => {

      if (t.from === fromId && t.to === toId) {
        automata.removeTransition(t);
      }

    });


    layout.sync();

  }

  function handleEdgeClick(fromId: number, toId: number): void {

    if (selectedTool === 'erasor') {

      removeEdge(fromId, toId);
      forceRender();

    }



  }

  function handleNodeClick(stateId: number, e: React.MouseEvent): void {

    if (selectedTool === 'erasor') {

      removeState(stateId);

    } else if (selectedTool === 'accept') {

      toggleAcceptanceState(stateId);

    } else if (selectedTool === 'transition') {

      handleStateClick(stateId);
      forceRender();
    }

    forceRender()

  }

  function createState(e: React.MouseEvent<SVGSVGElement>): boolean {

    const s: State | null = automata.addState();

    const svg = e.currentTarget;

    const rect = svg.getBoundingClientRect();

    if (s === null) return false;

    const p: Position = camera.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);


    layout.setPosition(s.getId(), p);

    return true;

  }

  function handleCanvasClick(e: React.MouseEvent<SVGSVGElement>) {

    if (selectedTool === 'state') {

      createState(e);

    } else if (selectedTool === 'transition') {

      cancel();

    }

    forceRender();


  }

  function handleNodeMouseDown(stateId: number): void {

    if (selectedTool === 'pointer') {
      startDrag(stateId);
    }

  }


  return (
    <svg width={width} height={height} viewBox={camera.viewBoxString} onMouseMove={handleMouseMove} onWheel={handleWheel} onMouseUp={endDrag} onMouseLeave={endDrag} onClick={handleCanvasClick} onContextMenu={(e) => e.preventDefault()}>
      <AutomataView automata={automata} layout={layout} onNodeMouseDown={handleNodeMouseDown} onNodeClick={handleNodeClick} onEdgeClick={handleEdgeClick} selectedId={(pendingFromId === null ? -1 : pendingFromId)} />
    </svg>
  );
}

export default Canvas;