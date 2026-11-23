import { useEffect, useState } from 'react';
import type { Automata } from '../../automata-lib/src/core/Automata'
import Canvas from './componets/Canvas';
import Sidebar from './componets/Sidebar';
import type { Tool } from './data/Tool';
import './App.css';
import { defaultToolSettings, type ToolSettings } from './data/ToolSettings';
import Topbar from './componets/Topbar/TopBar';
import { useAutomataRun } from './hooks/useAutomataRun';
import { useAutomataLayout } from './hooks/useAutomataLayout';
import DownBar from './componets/Downbar/Downbar'
import { AutomataSerializer } from "../../automata-lib/src/serializers/AutomataSerializer";
import AppHeader from "./componets/AppHeader/AppHeader"
import RegexDialog from './componets/RegexDialog'
import { useAutomataImportExport } from './hooks/useAutomataImportExport';
import ExampleDialog from './componets/ExampleDialog'

function App() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [selectedTool, setSelectedTool] = useState<Tool>('pointer');
  const [toolSettings, setToolSettings] = useState<ToolSettings>(defaultToolSettings);
  const [regexOpen, setRegexOpen] = useState(false)
  const { automata, layout, moveState, replaceAutomata } = useAutomataLayout();
  const { word, onWordChange, onRun, onForward, onBack, forwardDisabled, backDisabled, status, result, stepIndex } = useAutomataRun(automata);

  const { importAutomata, exportAutomata, error: fileError, clearError: clearFileError, } = useAutomataImportExport({
    automata,
    onImport: (importedAutomata) => {
      replaceAutomata(importedAutomata)
      onWordChange('')
      setSelectedTool('pointer')
    },
  })

  const [examplesOpen, setExamplesOpen] = useState(false)

  const highlightedStateIds: number[] = result?.stateSteps?.[stepIndex] ?? []

  function handleToolSelect(tool: Tool) {
    setSelectedTool(tool);
    console.log(tool);
  }

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const failedCharacterIndex =
    result &&
      !result.completed &&
      result.stateSteps.length > 1 &&
      stepIndex === result.stateSteps.length - 1
      ? stepIndex - 1
      : null


  function onExport(): void {
    const json = AutomataSerializer.serialize(automata);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "automaton.json";
    a.click();

    URL.revokeObjectURL(url);
  }
  console.log("step", stepIndex, result?.stateSteps, highlightedStateIds);


  return (
    <main className="app">
      <AppHeader
        onExport={exportAutomata}
        onRegex={() => setRegexOpen(true)}
        onExamples={() => setExamplesOpen(true)}
        onImport={importAutomata}
      />
      {fileError && (
        <div className="file-error" role="alert">
          <span>{fileError}</span>

          <button type="button" onClick={clearFileError}>
            Dismiss
          </button>
        </div>
      )}

      <Topbar
        selectedTool={selectedTool}
        toolSettings={toolSettings}
        onToolSettingsChange={setToolSettings}
      />

      <div className="workspace">
        <Sidebar
          selectedTool={selectedTool}
          onToolSelect={handleToolSelect}
        />

        <Canvas
          width={size.width - 72}
          height={size.height - 44 - 68}
          selectedTool={selectedTool}
          toolSettings={toolSettings}
          automata={automata}
          layout={layout}
          moveState={moveState}
          highlightedStateIds={highlightedStateIds}
        />
      </div>

      <DownBar
        word={word}
        onWordChange={onWordChange}
        onRun={onRun}
        onBack={onBack}
        onForward={onForward}
        backDisable={backDisabled}
        forwardDisable={forwardDisabled}
        status={status}
        consumedCharacters={
          Math.min(
            stepIndex,
            result
              ? result.transitions.length - (result.completed ? 0 : 1)
              : 0
          )
        }
        failedCharacterIndex={failedCharacterIndex}
      />
      {regexOpen && (
        <RegexDialog
          onClose={() => setRegexOpen(false)}
          onGenerate={(nextAutomata) => {
            replaceAutomata(nextAutomata)
            onWordChange('')
          }}
        />
      )}
      {examplesOpen && (
        <ExampleDialog
          onClose={() => setExamplesOpen(false)}
          onSelect={(nextAutomata) => {
            replaceAutomata(nextAutomata)
            onWordChange('')
            setSelectedTool('pointer')
          }}
        />  
      )}
    </main>
  );
}

export default App;
