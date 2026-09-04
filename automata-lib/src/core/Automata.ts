import { State } from "./State.js"
import type { Transition } from "./Transition.js"


export class Automata {

    private automataName: string;
    protected transitions : Transition[];

    protected states : State[];

    protected names : Map <number,string>;
    protected startStateId = 0;
    protected usedNames = new Set<string>();
    private nextStateId = 1;
    private nextTransitionId = 1;
    private nextGeneratedName = 1;
    
    constructor(name : string | null = "s"){
        this.automataName = name ?? "Automata";
        this.transitions = [];
        this.states = [];
        this.names = new Map();

        const s : string = name ?? "s";

        this.names.set(0,s);
        this.usedNames.add(s);
        const initial : State = new State(0);

        this.states.push(initial);

    }

    addState(name? : string) : State | null {

        if (name === undefined){
            do {
                name = `q${this.nextGeneratedName++}`;
            } while (this.usedNames.has(name));
        }

        if (this.usedNames.has(name)) return null;
    
        const id : number = this.nextStateId++;

        const s : State = new State(id);

        this.usedNames.add(name);

        this.names.set(id,name);

        this.states.push(s);

        return s;


    }

    setName(name: string) : void {
        this.automataName = name;
    }

    getAutomataName() : string {
        return this.automataName;
    }

    addTransition(transition : Transition) : Transition | null {
        const fromExists = this.states.some((state) => state.getId() === transition.from);
        const toExists = this.states.some((state) => state.getId() === transition.to);

        if (!fromExists || !toExists) return null;

        if (transition.id === undefined || transition.id === null || transition.id < 0) {
            transition.id = this.nextTransitionId++;
        }

        while (this.transitions.some((existingTransition) => existingTransition.id === transition.id)) {
            transition.id = this.nextTransitionId++;
        }

        this.transitions.push(transition);
        return transition;
    }

    removeTransition(transitionOrId : Transition | number) : boolean {
        const transitionIndex = typeof transitionOrId === "number"
            ? this.transitions.findIndex((transition) => transition.id === transitionOrId)
            : this.transitions.indexOf(transitionOrId);

        if (transitionIndex === -1) return false;

        this.transitions.splice(transitionIndex, 1);
        return true;
    }

    getStates() : State[] {
        return [...this.states];
    }

    getState(id : number) : State | null {
        return this.states.find((state) => state.getId() === id) ?? null;
    }

    setStateAcceptance(id : number) : boolean {
        const state = this.getState(id);
        if (state === null) return false;

        state.setAcceptance(true);
        return true;
    }

    getTransitions() : Transition[] {
        return [...this.transitions];
    }

    getName(id : number) : string | undefined {
        return this.names.get(id);
    }

    removeState(id : number) : boolean {
        if (id === this.startStateId) return false;

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

    setStartState(id : number) : void {
        const exists = this.states.some((state) => state.getId() === id);
        if (!exists) return;
        this.startStateId = id;
    }

    getStartStateId() : number {
        return this.startStateId;
    }


    private removeAllTransitionsFromState(id : number) : void {
        this.transitions = this.transitions.filter(
            (transition) => transition.from !== id && transition.to !== id
        );
    }

}