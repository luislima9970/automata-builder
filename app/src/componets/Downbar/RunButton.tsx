interface Props {
    onClick : ()=>(void);
}


function RunButton({onClick} : Props){

    return <button id="runButton" onClick={onClick}>Run</button>

}

export default RunButton;