import type { Tool } from '../data/Tool';

interface Props {

    tool: Tool;
    selectedTool: Tool;
    onToolSelect: (tool: Tool) => void;
    title: string;
    label: string;

};


function SidebarButton({ tool, selectedTool,onToolSelect,title,label} : Props){

    return <button className={selectedTool == tool ? 'sidebar-button selected' : 'sidebar-button'} onClick={() => onToolSelect(tool)} title={title}> 
        {label}
    </button>

}


export default SidebarButton;
