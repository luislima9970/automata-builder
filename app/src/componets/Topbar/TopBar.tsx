import type { Tool } from "../../data/Tool";
import { ToolSettings } from "../../data/ToolSettings";
import TransitionTopbar from "./TransitionTopbar";
import '../../../css/Topbar.css'

interface Props {

    selectedTool: Tool;
    toolSettings: ToolSettings
    onToolSettingsChange: (settings: ToolSettings) => void;


}

function Topbar({ selectedTool, toolSettings, onToolSettingsChange }: Props) {

    switch (selectedTool) {
        case 'pointer':
            return (
                <header className="topbar">
                    <span className="topbar-hint">Drag a state to reposition it</span>
                </header>
            );

        case 'state':
            return (
                <header className="topbar">
                    <span className="topbar-hint">Click the canvas to add a state</span>
                </header>
            );

        case 'transition':
            return (
                <header className="topbar">
                    <span className="topbar-hint">Click two states to connect them, symbol:</span>
                    <TransitionTopbar
                        symbol={toolSettings.transitionSymbol}
                        onSymbolChange={(symbol) =>
                            onToolSettingsChange({ ...toolSettings, transitionSymbol: symbol })
                        }
                    />
                </header>
            );

        case 'erasor':
            return (
                <header className="topbar">
                    <span className="topbar-hint">Click a state or transition to delete it</span>
                </header>
            );

        case 'accept':
            return (
                <header className="topbar">
                    <span className="topbar-hint">Click a state to toggle accepting</span>
                </header>
            );

        default:
            return <header className="topbar" />;
    }
}

export default Topbar;