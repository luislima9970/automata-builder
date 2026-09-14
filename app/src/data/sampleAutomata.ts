import { NFA } from "../../../automata-lib/src/core/NFA.js";
import { NFABuilder } from "../../../automata-lib/src/algorithms/NFABuilder.js";
import { Automata } from "../../../automata-lib/src/core/Automata.js";

export function buildSampleAutomata(): Automata {
  const nfa : NFA = NFABuilder.buildRegex("ab|c");
  return nfa;
}