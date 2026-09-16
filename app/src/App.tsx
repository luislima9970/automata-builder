import { useEffect, useState } from 'react';
import Canvas from './componets/Canvas';
import Sidebar from './componets/Sidebar';
import type { Tool } from './data/Tool';

import './App.css';

function App() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [selectedTool, setSelectedTool] = useState<Tool>('pointer');

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
      <Sidebar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />

      <Canvas
        width={size.width - 88}
        height={size.height}
      />
    </main>
  );
}

export default App;
