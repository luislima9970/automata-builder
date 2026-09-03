import type { NFAFragment } from "./NFAFragment.js";
import type { SyntaxNode }  from "./SyntaxNode.js";
import { NFA } from "./../core/NFA.js";
import type { Transition } from "../core/Transition.js";
import type { State } from "../core/State.js";
export class NFABuilder {

    build(root: SyntaxNode) : NFA{

        const nfa: NFA = new NFA();



    }

    private buildFragment(node: SyntaxNode, nfa: NFA): NFAFragment {
        switch (node.type) {
            case "literal": {
                if (node.symbol === undefined) {
                    throw new Error("Literal node has no symbol");
                }

                return this.buildLiteral(node.symbol, nfa);
            }

            case "epsilon":
                return this.buildEpsilon(nfa);

            case "concat": {
                if (node.left === undefined || node.right === undefined) {
                    throw new Error("Concat node requires two children");
                }

                const left = this.buildFragment(node.left, nfa);
                const right = this.buildFragment(node.right, nfa);

                return this.buildConcat(left, right, nfa);
            }

            case "union": {
                if (node.left === undefined || node.right === undefined) {
                    throw new Error("Union node requires two children");
                }

                const left = this.buildFragment(node.left, nfa);
                const right = this.buildFragment(node.right, nfa);

                return this.buildUnion(left, right, nfa);
            }

            case "star": {
                if (node.left === undefined) {
                    throw new Error("Star node requires one child");
                }

                const child = this.buildFragment(node.left, nfa);
                return this.buildStar(child, nfa);
            }

            case "plus": {
                if (node.left === undefined) {
                    throw new Error("Plus node requires one child");
                }

                const child = this.buildFragment(node.left, nfa);
                return this.buildPlus(child, nfa);
            }

            case "question": {
                if (node.left === undefined) {
                    throw new Error("Question node requires one child");
                }

                const child = this.buildFragment(node.left, nfa);
                return this.buildQuestion(child, nfa);
            }

            default:
                throw new Error(`Unknown syntax node type: ${node.type}`);

        }
    }

    private buildLiteral(symbol : string,nfa : NFA)  : NFAFragment {

        const state1 = nfa.addState();
        if (state1 === null) {
            throw new Error("Failed to create NFA state");
        }

        const state2 = nfa.addState();
        if (state2 === null) {
            throw new Error("Failed to create NFA state");
        }

        const transition : Transition = {from : state1.getId() ,to : state2.getId() ,symbol : symbol}

        const t = nfa.addTransition(transition);

        if (t === null){
            throw new Error("Failed to create Transtition");
        }

        return {startId : state1.getId(),endId : state2.getId()};

    }

    private buildEpsilon(nfa: NFA) : NFAFragment {
        const state1 = nfa.addState();
        const state2 = nfa.addState();

        if (state1 === null || state2 === null){
            throw new Error("Failed to create NFA state");
        }

        const transition = {from: state1.getId(),to:state2.getId(),symbol:null}; 

        const t = nfa.addTransition(transition);

        if (t === null) {
            throw new Error ("Failed to create transition");
        }

        return {startId: state1.getId(),endId: state2.getId()};

    }

    buildConcat(a : NFAFragment, b : NFAFragment,nfa : NFA) : NFAFragment {

        const transition : Transition = {from: a.endId, to: b.startId,symbol:null};

        const t = nfa.addTransition(transition);

        if (t === null){
            throw new Error ("Failed to add transition");
        }

        return {startId: a.startId,endId: b.endId};


    }

    private buildUnion(a : NFAFragment, b: NFAFragment, nfa: NFA) : NFAFragment {

        const state1 : State | null = nfa.addState();
        const state2 : State | null = nfa.addState();
        
        if (state1 === null || state2 === null){
            throw new Error("Failed to create State");
        }

        // from start to fragments
        const transition1 : Transition = {from:state1.getId(),to:a.startId, symbol: null};
        const transition2 : Transition = { from: state1.getId(),to: b.startId, symbol: null};
        // from fragments to end
        const transition3  : Transition = { from: a.endId, to: state2.getId(),symbol:null};
        const transition4 : Transition = { from: b.endId, to: state2.getId(), symbol:null};


        const t1 = nfa.addTransition(transition1);
        const t2 = nfa.addTransition(transition2);

        const t3 = nfa.addTransition(transition3);
        const t4 = nfa.addTransition(transition4);


        if (t1 === null || t2 === null || t3 === null || t4 === null){
            throw new Error("Failed to create transition");
        }

        return {startId: state1.getId(),endId: state2.getId()};

    }

    buildStar(a: NFAFragment,nfa: NFA): NFAFragment {
        const start = nfa.addState();

        if (start === null) {
            throw new Error("Failed to create state");
        }

        const toEnd = nfa.addTransition({from: start.getId(),to: a.endId,symbol: null});

        const toBeginning = nfa.addTransition({from: a.endId,to: start.getId(),symbol: null});

        const toStart = nfa.addTransition({from: start.getId(),to: a.startId,symbol: null});

        if (toEnd === null || toBeginning === null || toStart === null) {
            throw new Error("Failed to create star transitions");
        }

        return {startId: start.getId(),endId: a.endId};
    }

    private buildPlus(a: NFAFragment,nfa: NFA): NFAFragment {
        const start = nfa.addState();

        if (start === null) {
            throw new Error("Failed to create state");
        }


        const toBeginning = nfa.addTransition({from: a.endId,to: start.getId(),symbol: null});

        const toStart = nfa.addTransition({from: start.getId(),to: a.startId,symbol: null});

        if (toBeginning === null || toStart === null) {
            throw new Error("Failed to create plus transitions");
        }

        return {startId: start.getId(),endId: a.endId};
    }

    private buildQuestion(a : NFAFragment, nfa: NFA) : NFAFragment {
        const start = nfa.addState();

        if (start === null) {
            throw new Error("Failed to create state");
        }

        const toEnd = nfa.addTransition({from: start.getId(),to: a.endId,symbol: null});


        const toStart = nfa.addTransition({from: start.getId(),to: a.startId,symbol: null});

        if (toEnd === null || toStart === null) {
            throw new Error("Failed to create question transitions");
        }

        return {startId: start.getId(),endId: a.endId};
    }

}