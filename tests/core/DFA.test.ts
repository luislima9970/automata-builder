import { describe, expect, it } from "vitest";
import { DFA } from "../../src/core/DFA.js";

describe("DFA", () => {
  it("rejects adding a second transition from the same state with the same symbol", () => {
    const dfa = new DFA("test");
    const q1 = dfa.addState("q1");

    expect(q1).not.toBeNull();

    const t1 = { from: 0, symbol: "a", to: 0 };
    const t2 = { from: 0, symbol: "a", to: q1!.getId() };

    expect(dfa.addTransition(t1)).toEqual(t1);
    expect(dfa.addTransition(t2)).toBeNull();
  });

  it("rejects epsilon transitions", () => {
    const dfa = new DFA("start");

    expect(dfa.addTransition({
      from: 0,
      symbol: null,
      to: 0,
    })).toBeNull();
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

  it("returns incomplete when input has no valid path", () => {
    const dfa = new DFA("start");

    const q1 = dfa.addState("q1");
    expect(q1).not.toBeNull();

    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    expect(dfa.addTransition(t1)).toEqual(t1);

    const result = dfa.run("b");

    expect(result.completed).toBe(false);
    expect(result.finalStateId).toBeNull();
  });

  it("accepts empty string if start state is accepting", () => {
    const dfa = new DFA("start");
    dfa.getStates()[0]!.setAcceptance(true);

    expect(dfa.accepts("")).toBe(true);
  });

  it("rejects empty string if start state is not accepting", () => {
    const dfa = new DFA("start");

    expect(dfa.accepts("")).toBe(false);
  });

  it("correctly handles multi-step deterministic paths", () => {
    const dfa = new DFA("start");

    const q1 = dfa.addState("q1");
    const q2 = dfa.addState("q2");
    const q3 = dfa.addState("q3");
    expect(q1).not.toBeNull();
    expect(q2).not.toBeNull();
    expect(q3).not.toBeNull();
    q3!.setAcceptance(true);

    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    const t2 = { from: q1!.getId(), symbol: "b", to: q2!.getId() };
    const t3 = { from: q2!.getId(), symbol: "c", to: q3!.getId() };

    expect(dfa.addTransition(t1)).toEqual(t1);
    expect(dfa.addTransition(t2)).toEqual(t2);
    expect(dfa.addTransition(t3)).toEqual(t3);

    expect(dfa.accepts("abc")).toBe(true);
    expect(dfa.accepts("ab")).toBe(false);
    expect(dfa.accepts("abcd")).toBe(false);
  });

  it("invalidates index cache when transition is removed", () => {
    const dfa = new DFA("start");

    const q1 = dfa.addState("q1");
    expect(q1).not.toBeNull();

    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    expect(dfa.addTransition(t1)).toEqual(t1);

    expect(dfa.run("a").completed).toBe(true);

    expect(dfa.removeTransition(t1)).toBe(true);

    const result = dfa.run("a");
    expect(result.completed).toBe(false);
  });

  it("invalidates index cache when state is removed", () => {
    const dfa = new DFA("start");

    const q1 = dfa.addState("q1");
    expect(q1).not.toBeNull();

    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    expect(dfa.addTransition(t1)).toEqual(t1);

    expect(dfa.run("a").completed).toBe(true);

    expect(dfa.removeState(q1!.getId())).toBe(true);

    const result = dfa.run("a");
    expect(result.completed).toBe(false);
  });
});
