import { useState } from "react";
import { Automata } from "../../../automata-lib/src/core/Automata";
import type { RunResult } from "../../../automata-lib/src/core/RunResult"; 

export function useAutomataRun(automata: Automata) {
  const [word, setWord] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  function run() {
    const runResult = automata.run(word);
    setResult(runResult);
    setStepIndex(0);
  }

  return { word, setWord, result, stepIndex, setStepIndex, run };
}