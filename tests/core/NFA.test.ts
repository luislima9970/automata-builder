import { describe, expect, it } from "vitest";
import { NFA } from "../../src/core/NFA.js";

describe("NFA", () => {
  it("returns transitions for all current states on a symbol and follows them to next states", () => {
    const nfa = new NFA("start");

    const q1 = nfa.addState("q1");
    const q2 = nfa.addState("q2");
    expect(q1).not.toBeNull();
    expect(q2).not.toBeNull();

    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    const t2 = { from: 0, symbol: "a", to: q2!.getId() };

    expect(nfa.addTransition(t1)).toEqual(t1);
    expect(nfa.addTransition(t2)).toEqual(t2);

    const transitions = nfa.getTransitionsFor([0], "a");
    expect(transitions).toHaveLength(2);
    expect(transitions.map((t) => t.to).sort()).toEqual([q1!.getId(), q2!.getId()].sort());
    expect(nfa.nextStates([0], "a").sort()).toEqual([q1!.getId(), q2!.getId()].sort());
  });
});
