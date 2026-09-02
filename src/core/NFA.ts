import { Automata } from "./Automata.js"
import { State } from "./State.js"
import type { Transition } from "./Transition.js"
import type { DFARunResult } from "./DFARunResult.js"
import type { Acceptor } from "./Acceptor.js"




export class NFA extends Automata implements Acceptor {

    private indexes : Map<number, Map<string | null, Transition[]>> | null = null;

    nextStates(currentIds: number[], symbol: string | null) : number[] {

        

    }


}