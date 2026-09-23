interface Props {

    word : string;
    onChange : (word: string) => void;


}


function WordInput({ word, onChange }: Props) {
    return (
    <>
    <label htmlFor="WordInput">Word: </label>
    <input id="WordInput" type="text" value={word} onChange={(e)=>onChange(e.target.value)} />
    </> );

}