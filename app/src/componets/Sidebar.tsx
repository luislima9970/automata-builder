import '../../css/Sidebar.css';
import type { Tool } from '../data/Tool';
import SidebarButton from './SidebarButton';


interface Props {
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
}

interface SideButton {

  tool: Tool;
  title: string;
  label: string;


}

const buttons : SideButton[] = [{tool:'pointer',title:'Pointer',label:'P'},{tool:'state',title:'State',label:'○'},{tool:'transition',title:'Transtition',label:'→'},{tool:'erasor',title:'Erason',label:'X'}]


function Sidebar({ selectedTool, onToolSelect }: Props) {

  

  return (
    <aside className="sidebar">
      {
        buttons.map((button) => (<SidebarButton tool={button.tool} selectedTool={selectedTool} onToolSelect={onToolSelect} title={button.title} label={button.label} />))
      }
    </aside>
  );
}

export default Sidebar;