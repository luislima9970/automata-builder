import { State } from "./State.js"
import type { Transition } from "./Transition.js"


class Automata {

    protected transitions : Map<number, Transition[]>;

    protected states : State[];

    protected names : Map <number,string>;

    constructor(name : string | null = "s"){
        this.transitions = new Map();
        this.states = [];
        this.names = new Map();

        const s : string = name ?? "s";

        this.names.set(0,s);

        const initial : State = new State(0);

        this.states.push(initial);

    }


}