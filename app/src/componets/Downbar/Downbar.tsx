import ForwardBackwardButtons from "./ForwardBackwardButtons";
import RunButton from "./RunButton";
import WordInput from "./WordInput";
import '../../../css/Downbar.css'


interface Props {
  word: string;
  onWordChange: (word: string) => void;
  onRun: () => void;
  onBack: () => void;
  onForward: () => void;
  onExport: () => void;
  forwardDisable : boolean;
  backDisable : boolean;
}

function DownBar({ word, onWordChange, onRun, onBack, onForward, onExport, forwardDisable,backDisable }: Props) {
  return (
    <div className="down-bar">
      <button className="export-button" onClick={onExport}>Export JSON</button>

      <div className="run-controls">
        <WordInput word={word} onChange={onWordChange} />
        <RunButton onClick={onRun} />
      </div>

      <ForwardBackwardButtons onBack={onBack} onForward={onForward} forwardDisable={forwardDisable} backDisable={backDisable} />
    </div>
  );
}

export default DownBar;