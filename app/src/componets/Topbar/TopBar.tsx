import type { Tool } from "../../data/Tool";
import { ToolSettings } from "../../data/ToolSettings";
import TransitionTopbar from "./TransitionTopbar";

interface Props {

    selectedTool: Tool;
    toolSettings: ToolSettings
    onToolSettingsChange: (settings: ToolSettings) => void;


}

function Topbar({ selectedTool, toolSettings, onToolSettingsChange }: Props) {

    switch (selectedTool) {
        case 'transition':
            return (
                <header className="topbar">
                    <TransitionTopbar
                        symbol={toolSettings.transitionSymbol}
                        onSymbolChange={(symbol) =>
                            onToolSettingsChange({ ...toolSettings, transitionSymbol: symbol })
                        }
                    />
                </header>
            );
        default:
            return null;
    }
}

export default Topbar;