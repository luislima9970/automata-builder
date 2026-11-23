import AutomataView from "./AutomataView"
import { useCamera } from "../hooks/useCamera";
import { useNodeDrag } from "../hooks/useNodeDrag";
import type { Tool } from "../data/Tool.js"
import { State } from "automata-lib/src/core/State.js";
import { Position } from "../../../automata-visualizer/src/Position.js";
import { useEdgeDraw } from "../hooks/useEdgeDraw.js";
import { useEffect, useReducer } from "react";
import { Transition } from "automata-lib/src/core/Transition.js";
import { ToolSettings } from "../data/ToolSettings.js";
import { Automata } from "../../../automata-lib/src/core/Automata.js";
import { AutomataLayout } from "../../../automata-visualizer/src/AutomataLayout.js";


interface Props {
  width: number;
  height: number;
  selectedTool: Tool;
  toolSettings: ToolSettings;
  automata: Automata;
  layout: AutomataLayout;
  moveState: (stateId: number, dx: number, dy: number) => void;
  highlightedStateIds: number[];
  onAutomataChange : () => void;
}

const cursorPaths: Record<Tool, string> = {
  pointer: '<path d="m5 3 14 9-7 1.5L8.5 20 5 3Z" fill="white"/>',
  state: '<circle cx="10" cy="14" r="7"/><path d="M18 2v6M15 5h6"/>',
  transition: '<circle cx="4" cy="12" r="2"/><path d="M6 12h15m-5-5 5 5-5 5"/>',
  epsilon: '<path d="M17 6c-6-4-13 2-7 6-6 4 1 10 7 6M7 12h8"/>',
  accept: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/>',
  erasor: '<path d="m4 14 9-10a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-8 9H9l-5-4a2 2 0 0 1 0-3Z"/><path d="m9 9 8 8M13 21h8"/>',
}

function toolCursor(tool: Tool) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
      width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="#2563eb" stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round">
      ${cursorPaths[tool]}
    </svg>
  `

  const hotspot = tool === 'pointer' ? '5 3' : '12 12'

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotspot}, crosshair`
}

function Canvas({ width, height, selectedTool, toolSettings, automata, layout, moveState, highlightedStateIds, onAutomataChange }: Props) {
  const { camera, handleMouseMove: handleCameraMove, handleWheel } = useCamera(width, height);
  const { startDrag, handleDragMove, endDrag } = useNodeDrag(camera.zoom, moveState);
  const [, forceRender] = useReducer((value: number) => value + 1, 0);
  const { pendingFromId, handleStateClick, cancel } = useEdgeDraw((fromId, toId, symbol) => {
    const t: Transition = { from: fromId, to: toId, symbol: symbol };
    automata.addTransition(t);
    layout.sync();
    onAutomataChange();
  });

  useEffect(() => {

    cancel();
    forceRender();
  }, [selectedTool])

  function handleMouseMove(e: React.MouseEvent) {
    const wasDragging = handleDragMove(e);
    if (!wasDragging) handleCameraMove(e);
  }


  function handleNodeRename(stateId: number, name: string): boolean {
    if (selectedTool !== 'pointer') return false

    const renamed = automata.renameState(stateId, name)

    if (renamed) forceRender()

    return renamed
  }

  function removeState(stateId: number): void {
    automata.removeState(stateId);
    layout.sync();
    onAutomataChange();
  }

  function toggleAcceptanceState(stateId: number) {

    automata.getState(stateId)?.toggleAcceptance();
    layout.sync();
    onAutomataChange();
  }

  function removeEdge(fromId: number, toId: number): void {

    automata.getTransitions().map((t) => {

      if (t.from === fromId && t.to === toId) {
        automata.removeTransition(t);
      }

    });


    layout.sync();
    onAutomataChange();

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

      handleStateClick(stateId, ((toolSettings.transitionSymbol == '' || toolSettings.transitionSymbol == 'ε') ? null : toolSettings.transitionSymbol));
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
    <svg width={width} height={height} viewBox={camera.viewBoxString} onMouseMove={handleMouseMove} onWheel={handleWheel} onMouseUp={endDrag} onMouseLeave={endDrag} onClick={handleCanvasClick} onContextMenu={(e) => e.preventDefault()} style={{ cursor: toolCursor(selectedTool) }}>
      <AutomataView automata={automata} layout={layout} onNodeMouseDown={handleNodeMouseDown} onNodeClick={handleNodeClick} onEdgeClick={handleEdgeClick} selectedId={(pendingFromId === null ? -1 : pendingFromId)} highlightedStateIds={highlightedStateIds} canRename = {selectedTool === 'pointer'} onNodeRename={handleNodeRename}/>
    </svg>
  );
}

export default Canvas;