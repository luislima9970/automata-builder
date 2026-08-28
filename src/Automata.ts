import { State } from "./State.js"
import type { Transition } from "./Transition.js"


export class Automata {

    protected transitions : Transition[];

    protected states : State[];

    protected names : Map <number,string>;

    protected usedNames = new Set<string>();
    private nextStateId = 1;
    
    constructor(name : string | null = "s"){
        this.transitions = [];
        this.states = [];
        this.names = new Map();

        const s : string = name ?? "s";

        this.names.set(0,s);
        this.usedNames.add(s);
        const initial : State = new State(0);

        this.states.push(initial);

    }

    addState(name : string) : boolean {

        if (this.usedNames.has(name)) return false;
    
        const id : number = this.nextStateId++;

        const s : State = new State(id);

        this.usedNames.add(name);

        this.names.set(id,name);

        this.states.push(s);

        return true;


    }

    addTransition(transition : Transition) : void {
        this.transitions.push(transition);
    }

    removeTransition(transition : Transition) : boolean {
        const transitionIndex = this.transitions.indexOf(transition);

        if (transitionIndex === -1) return false;

        this.transitions.splice(transitionIndex, 1);
        return true;
    }

    removeState(id : number) : boolean {
        const stateIndex = this.states.findIndex((state) => state.getId() === id);

        if (stateIndex === -1) return false;

        this.states.splice(stateIndex, 1);
        this.removeAllTransitionsFromState(id);

        const stateName = this.names.get(id);
        if (stateName !== undefined) {
            this.usedNames.delete(stateName);
        }
        this.names.delete(id);

        return true;
    }

    private removeAllTransitionsFromState(id : number) : void {
        this.transitions = this.transitions.filter(
            (transition) => transition.from !== id && transition.to !== id
        );
    }

}