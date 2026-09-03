import type { NFAFragment } from "./NFAFragment.js";
import type { SyntaxNode }  from "./SyntaxNode.js";
import { NFA } from "./../core/NFA.js";
import type { Transition } from "../core/Transition.js";
import type { State } from "../core/State.js";
export class NFABuilder {

    build(root: SyntaxNode) : NFA{

        const nfa: NFA = new NFA();



    }

    private buildFragment(node : SyntaxNode,nfa : NFA) : NFAFragment {

        if (node.left !== undefined){
            this.buildFragment(node.left,nfa)
        }
        if (node.right !== undefined){
            this.buildFragment(node.right,nfa);
        }

        switch(node.type){

        }


    }

    buildLiteral(symbol : string,nfa : NFA)  : NFAFragment {

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

    buildEpsilon(nfa: NFA) : NFAFragment {
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

    buildUnion(a : NFAFragment, b: NFAFragment, nfa: NFA) : NFAFragment {

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

}