import { useEffect, useState } from 'react';
import Canvas from './componets/Canvas';
import Sidebar from './componets/Sidebar';
import type { Tool } from './data/Tool';
import './App.css';
import { defaultToolSettings, type ToolSettings } from './data/ToolSettings';
import Topbar from './componets/Topbar/TopBar';
import { useAutomataRun } from './hooks/useAutomataRun';
import { useAutomataLayout } from './hooks/useAutomataLayout';
import DownBar from './componets/Downbar/Downbar'
import AppHeader from "./componets/AppHeader/AppHeader"
import RegexDialog from './componets/RegexDialog'
import { useAutomataImportExport } from './hooks/useAutomataImportExport';
import ExampleDialog from './componets/ExampleDialog'
import { useEditorHistory } from './hooks/useEditorHistory';

function App() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [selectedTool, setSelectedTool] = useState<Tool>('pointer');
  const [toolSettings, setToolSettings] = useState<ToolSettings>(defaultToolSettings);
  const [regexOpen, setRegexOpen] = useState(false)
  const { automata, layout, moveState, replaceAutomata, captureSnapshot, restoreSnapshot } = useAutomataLayout();
  const { word, onWordChange, onRun, onForward, onBack, resetRun, forwardDisabled, backDisabled, status, result, stepIndex } = useAutomataRun(automata);

  const history = useEditorHistory({
    capture: captureSnapshot,
    restore: (snapshot) => {
      restoreSnapshot(snapshot)
      resetRun()
    },
  })

  const { importAutomata, exportAutomata, error: fileError, clearError: clearFileError, } = useAutomataImportExport({
    automata,
    onImport: (importedAutomata) => {
      history.beginEdit();
      replaceAutomata(importedAutomata)
      onWordChange('')
      setSelectedTool('pointer')
      history.commitEdit();
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
          onAutomataChange={resetRun}
          highlightedStateIds={highlightedStateIds}
          onEditStart={history.beginEdit}
          onEditEnd={history.commitEdit}
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
        consumedCharacters={stepIndex}
        failedCharacterIndex={failedCharacterIndex}
      />
      {regexOpen && (
        <RegexDialog
          onClose={() => setRegexOpen(false)}
          onGenerate={(nextAutomata) => {
            history.beginEdit();
            replaceAutomata(nextAutomata)
            history.commitEdit();
            onWordChange('')
          }}
        />
      )}
      {examplesOpen && (
        <ExampleDialog
          onClose={() => setExamplesOpen(false)}
          onSelect={(nextAutomata) => {
            history.beginEdit();
            replaceAutomata(nextAutomata)
            history.commitEdit();
            onWordChange('')
            setSelectedTool('pointer')
          }}
        />
      )}
    </main>
  );
}

export default App;
