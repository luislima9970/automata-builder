import { useEffect, useState } from 'react';
import Canvas from './componets/Canvas';
import Sidebar from './componets/Sidebar';
import type { Tool } from './data/Tool';

import './App.css';
import { defaultToolSettings, ToolSettings } from './data/ToolSettings';
import Topbar from './componets/Topbar/TopBar';

function App() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [selectedTool, setSelectedTool] = useState<Tool>('pointer');
  const [toolSettings, setToolSettings] = useState<ToolSettings>(defaultToolSettings);

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

  return (
    <main className="app">
      <Sidebar selectedTool={selectedTool} onToolSelect={handleToolSelect} />

      <div className="workspace">
        <Topbar
          selectedTool={selectedTool}
          toolSettings={toolSettings}
          onToolSettingsChange={setToolSettings}
        />

        <Canvas
          width={size.width - 88}
          height={size.height}
          selectedTool={selectedTool}
          toolSettings={toolSettings}
        />
      </div>
    </main>
  );
}

export default App;
