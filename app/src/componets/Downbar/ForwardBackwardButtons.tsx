

interface Props {
    onBack: () => void;
    onForward: () => void;
    forwardDisable: boolean;
    backDisable: boolean;

};



function ForwardBackwardButtons({ onBack, onForward, forwardDisable, backDisable }: Props) {


    return (
        <div className="undo-redo">
            <button onClick={onBack} title="Backward" disabled={backDisable}>←</button>
            <button onClick={onForward} title="Forward" disabled={forwardDisable}>→</button>
        </div>
    );

}

export default ForwardBackwardButtons;