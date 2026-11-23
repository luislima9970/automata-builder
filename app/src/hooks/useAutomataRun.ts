import { useState } from "react";
import { Automata } from "../../../automata-lib/src/core/Automata.js";
import type { RunResult } from "../../../automata-lib/src/core/RunResult.js";

export function useAutomataRun(automata: Automata) {
    const [word, setWord] = useState("");
    const [result, setResult] = useState<RunResult | null>(null);
    const [stepIndex, setStepIndex] = useState<number>(0);

    const status: "rejected" | "idle" | "accepted" =
        result === null
            ? "idle"
            : automata.accepts(word)
                ? "accepted"
                : "rejected";

    const backDisabled =
        result === null || stepIndex === 0;

    const forwardDisabled =
        result === null || stepIndex >= result.transitions.length;

    function onWordChange(newWord: string) {
        setWord(newWord);
        setResult(null);
        setStepIndex(0);
    }

    function onRun() {
        const runResult = automata.run(word);

        if (!runResult.completed && runResult.stateSteps.length > 0) {
            runResult.transitions.push([]);
            runResult.stateSteps.push([]);
        }

        setResult(runResult);
        setStepIndex(0);
    }

    function onForward() {
        if (result === null) return;
        setStepIndex((i) => Math.min(i + 1, result.transitions.length));
    }

    function onBack() {
        setStepIndex((i) => Math.max(i - 1, 0));
    }

    function resetRun() {
        setResult(null)
        setStepIndex(0)
    }

    return { word, onWordChange, onRun, onForward, onBack, resetRun, forwardDisabled, backDisabled, status, result, stepIndex };
}