import AutomataView from "./AutomataView"
import { useCamera } from "../hooks/useCamera";
import { useAutomataLayout } from "../hooks/useAutomataLayout";
import { useNodeDrag } from "../hooks/useNodeDrag";
import type { Tool } from "../data/Tool.js"
import { State } from "automata-lib/src/core/State.js";
import { Position } from "../../../automata-visualizer/src/Position.js";
import { useReducer } from "react";


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

  function handleMouseMove(e: React.MouseEvent) {
    const wasDragging = handleDragMove(e);
    if (!wasDragging) handleCameraMove(e);
  }

  function removeState(stateId: number): void {
    automata.removeState(stateId);
    layout.sync();
  }

  function toggleAcceptanceState(stateId : number){

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

    } else  if (selectedTool === 'accept'){

      toggleAcceptanceState(stateId);
      
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
    if (selectedTool !== 'state') return;

    if (e.target !== e.currentTarget) return;

    createState(e);

    forceRender();


  }

  function handleNodeMouseDown(stateId: number): void {

    if (selectedTool === 'pointer') {
      startDrag(stateId);
    }

  }


  return (
    <svg width={width} height={height} viewBox={camera.viewBoxString} onMouseMove={handleMouseMove} onWheel={handleWheel} onMouseUp={endDrag} onMouseLeave={endDrag} onClick={handleCanvasClick} onContextMenu={(e) => e.preventDefault()}>
      <AutomataView automata={automata} layout={layout} onNodeMouseDown={handleNodeMouseDown} onNodeClick={handleNodeClick} onEdgeClick={handleEdgeClick} />
    </svg>
  );
}

export default Canvas;