import { useEffect, useState } from 'react';
import Canvas from './componets/Canvas';
import Sidebar from './componets/Sidebar';
import type { Tool } from './data/Tool';
import './App.css';
import { defaultToolSettings, ToolSettings } from './data/ToolSettings';
import Topbar from './componets/Topbar/TopBar';
import { useAutomataRun } from './hooks/useAutomataRun';
import { useAutomataLayout } from './hooks/useAutomataLayout';
import DownBar from './componets/Downbar/Downbar'

function App() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [selectedTool, setSelectedTool] = useState<Tool>('pointer');
  const [toolSettings, setToolSettings] = useState<ToolSettings>(defaultToolSettings);
  const { automata, layout, moveState } = useAutomataLayout();
  const { word, onWordChange, onRun, onForward, onBack, forwardDisabled, backDisabled,status } = useAutomataRun(automata);


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


  function onExport(): void {
    console.log("To implement!");
  }

  return (
    <main className="app">
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
        />
      </div>

      <DownBar
        word={word}
        onWordChange={onWordChange}
        onRun={onRun}
        onBack={onBack}
        onForward={onForward}
        onExport={onExport}
        backDisable={backDisabled}
        forwardDisable={forwardDisabled}
        status={status}
      />
    </main>
  );
}

export default App;
