import { useEffect, useState } from 'react'
import Canvas from './componets/Canvas'

import './App.css'


function App() {


  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });


  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <Canvas width={size.width} height={size.height} />;
}

export default App;
