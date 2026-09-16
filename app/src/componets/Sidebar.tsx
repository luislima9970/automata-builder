import '../../css/Sidebar.css';
import type { Tool } from '../data/Tool';

interface Props {
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
}


function Sidebar({selectedTool,onToolSelect} : Props) {
  return (
    <aside className="sidebar">
      <button className={selectedTool  === 'state' ? 'sidebar-button selected' : 'sidebar-button'}
      onClick={() => onToolSelect('state')}
      title="Add state">
        ○
      </button>

      <button className={selectedTool  === 'transition' ? 'sidebar-button selected' : 'sidebar-button'}
      onClick={() => onToolSelect('transition')}
      title="Add transition">
        →
      </button>

      <button className={selectedTool  === 'epsilon' ? 'sidebar-button selected' : 'sidebar-button'}
      onClick={() => onToolSelect('epsilon')}
      title="Add epsilon transition">
        <span className="epsilon-transition">
          <span>ε</span>
          <span>→</span>
        </span>
      </button>
    </aside>
  );
}

export default Sidebar;