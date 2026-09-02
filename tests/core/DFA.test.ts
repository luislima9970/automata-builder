import { describe, expect, it } from "vitest";
import { DFA } from "../../src/core/DFA.js";

describe("DFA", () => {
  it("rejects adding a second transition from the same state with the same symbol", () => {
    const dfa = new DFA("test");

    const t1 = { from: 0, symbol: "a", to: 0 };
    const t2 = { from: 0, symbol: "a", to: 1 };

    expect(dfa.addTransition(t1)).toEqual(t1);
    expect(dfa.addTransition(t2)).toBeNull();
  });

  it("allows different symbols from the same state", () => {
    const dfa = new DFA("test");

    const q1 = dfa.addState("q1");
    expect(q1).not.toBeNull();

    const t1 = { from: 0, symbol: "a", to: 0 };
    const t2 = { from: 0, symbol: "b", to: q1!.getId() };

    expect(dfa.addTransition(t1)).toEqual(t1);
    expect(dfa.addTransition(t2)).toEqual(t2);
  });

  it("runs through the DFA and returns the transitions taken for valid input", () => {
    const dfa = new DFA("start");

    const q1 = dfa.addState("q1");
    expect(q1).not.toBeNull();

    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    const t2 = { from: q1!.getId(), symbol: "b", to: 0 };

    expect(dfa.addTransition(t1)).toEqual(t1);
    expect(dfa.addTransition(t2)).toEqual(t2);

    const path = dfa.run("ab");

    expect(path.transitions).toHaveLength(2);
    expect(path.transitions[0]).toMatchObject(t1);
    expect(path.transitions[1]).toMatchObject(t2);
    expect(path.finalStateId).toBe(0);
    expect(path.completed).toBe(true);
  });

  it("accepts input only when the final state is accepting", () => {
    const dfa = new DFA("start");

    const q1 = dfa.addState("q1");
    expect(q1).not.toBeNull();
    q1!.setAcceptance(true);

    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    expect(dfa.addTransition(t1)).toEqual(t1);

    expect(dfa.accepts("a")).toBe(true);
    expect(dfa.accepts("b")).toBe(false);
  });

  it("uses the transition index for direct lookup and next-state navigation", () => {
    const dfa = new DFA("start");

    const q1 = dfa.addState("q1");
    expect(q1).not.toBeNull();

    const transition = { from: 0, symbol: "a", to: q1!.getId() };
    expect(dfa.addTransition(transition)).toEqual(transition);

    expect(dfa.getTransitionFor(0, "a")).toMatchObject(transition);
    expect(dfa.nextState(0, "a")?.getId()).toBe(q1!.getId());
  });

  it("rebuilds the transition index after adding new transitions", () => {
    const dfa = new DFA("start");

    const q1 = dfa.addState("q1");
    expect(q1).not.toBeNull();

    const first = { from: 0, symbol: "a", to: q1!.getId() };
    expect(dfa.addTransition(first)).toEqual(first);
    expect(dfa.run("a").completed).toBe(true);

    const q2 = dfa.addState("q2");
    expect(q2).not.toBeNull();

    const second = { from: 0, symbol: "b", to: q2!.getId() };
    expect(dfa.addTransition(second)).toEqual(second);

    const result = dfa.run("b");

    expect(result.completed).toBe(true);
    expect(result.finalStateId).toBe(q2!.getId());
  });
});
