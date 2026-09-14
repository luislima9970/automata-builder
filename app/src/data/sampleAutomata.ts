import { NFABuilder } from "../../../automata-lib/src/algorithms/NFABuilder.js";
import { NFA } from "../../../automata-lib/src/core/NFA.js"
import { Transition } from "../../../automata-lib/src/core/Transition.js";
import { Automata } from "../../../automata-lib/src/core/Automata.js";

export function buildSampleAutomata(): Automata {
  const automata : Automata = new Automata();
  const t : Transition = {from: 0,to:0,symbol:"a"};
  const t2 : Transition = {from: 0,to:1,symbol:null};
  const t3 : Transition = {from: 0,to:0,symbol:null};
  automata.addState("ola");
  automata.addTransition(t);
  automata.addTransition(t2);
  automata.addTransition(t3);
  automata.setStateAcceptance(0);
  return automata;
}