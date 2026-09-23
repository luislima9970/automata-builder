import ForwardBackwardButtons from './ForwardBackwardButtons';
import RunButton from './RunButton';
import WordInput from './WordInput'

interface Props {
    word: string;
    onWordChange: (word: string) => void;
    onRun: () => void;
    onBack: () => void;
    onForward: () => void;
    forwardDisable : boolean;
    backDisable : boolean;
}

function RunBar({ word, onWordChange, onRun, onBack, onForward, forwardDisable, backDisable }: Props) {
    return (
        <div className="run-bar">
            <WordInput word={word} onChange={onWordChange} />
            <RunButton onClick={onRun} />
            <ForwardBackwardButtons onBack={onBack} onForward={onForward} forwardDisable={forwardDisable} backDisable={backDisable} />
        </div>
    );
}

export default RunBar;