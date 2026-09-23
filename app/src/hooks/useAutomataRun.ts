import { useState } from "react";
import { Automata } from "automata-lib";
import { Transition } from "automata-lib/src/core/Transition";

export function useAutomataRun(automata : Automata) {
    const [word, setWord] = useState("");
    const [path, setPath] = useState<Transition[][] | null>(null);
    const [stepIndex,setStepIndex] = useState<number>(0);

    function run(){

        if ()

    }
}