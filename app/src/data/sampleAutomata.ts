import { NFABuilder } from "../../../automata-lib/src/algorithms/NFABuilder.js";
import { NFA } from "../../../automata-lib/src/core/NFA.js"
import { Transition } from "../../../automata-lib/src/core/Transition.js";
import { Automata } from "../../../automata-lib/src/core/Automata.js";

export function buildSampleAutomata(): Automata {
  const nfa : NFA = NFABuilder.buildRegex("((a|b)+)|\\+");
  const automata = new Automata();

  automata.addState("fragger");

  const t : Transition = {from: 0,to:1,symbol:"a"};
  const t1 : Transition = {from: 1,to:0,symbol:"b"};

  automata.addTransition(t);
  automata.addTransition(t1);
  return automata;
}