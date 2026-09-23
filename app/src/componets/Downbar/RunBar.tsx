
import ForwardBackwardButtons from './ForwardBackwardButtons';
import RunButton from './RunButton';
import WordInput from './WordInput'

interface Props {

    word: string;
    onWordChange: () => void;
    onRun: () => void;
    onBack(): () => void;
    onForward: () => void;


}






function RunBar({ word, onWordChange, onRun, onBack, onForward }: Props) {
    return (
        <div className="run-bar">
            <WordInput word={word} onChange={onWordChange} />
            <RunButton onClick={onRun} />
            <ForwardBackwardButtons onBack={onBack} onForward={onForward} />
        </div>
    );
}



