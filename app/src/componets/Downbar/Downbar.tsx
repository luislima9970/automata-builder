import ForwardBackwardButtons from "./ForwardBackwardButtons";
import RunButton from "./RunButton";
import WordInput from "./WordInput";
import AcceptingTag from "./AcceptingTag";
import '../../../css/Downbar.css'


interface Props {
  word: string;
  onWordChange: (word: string) => void;
  onRun: () => void;
  onBack: () => void;
  onForward: () => void;
  forwardDisable : boolean;
  backDisable : boolean;
  status : "idle" | "accepted" | "rejected";
}

function DownBar({ word, onWordChange, onRun, onBack, onForward, forwardDisable,backDisable, status }: Props) {
  return (
    <div className="down-bar">

      <div className="run-controls">
        <WordInput word={word} onChange={onWordChange} />
        <RunButton onClick={onRun} />
        <AcceptingTag status={status}/>
      </div>

      <ForwardBackwardButtons onBack={onBack} onForward={onForward} forwardDisable={forwardDisable} backDisable={backDisable} />

    </div>
  );
}

export default DownBar;