

interface Props {

    onBack: () => void;
    onForward: () => void;

};



function ForwardBackwardButtons({ onBack, onForward }: Props) {

    return (
    <div className="undo-redo">
        <button onClick={onBack} title="Backward">←</button>
        <button onClick={onForward} title="Forward">→</button>
    </div>
    );

}

export default ForwardBackwardButtons;