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

  it("runs through NFA and returns all paths for nondeterministic input", () => {
    const nfa = new NFA("start");

    const q1 = nfa.addState("q1");
    const q2 = nfa.addState("q2");
    expect(q1).not.toBeNull();
    expect(q2).not.toBeNull();

    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    const t2 = { from: 0, symbol: "a", to: q2!.getId() };

    expect(nfa.addTransition(t1)).toEqual(t1);
    expect(nfa.addTransition(t2)).toEqual(t2);

    const result = nfa.run("a");

    expect(result.completed).toBe(true);
    expect(result.finalStateIds).toHaveLength(2);
    expect(result.finalStateIds.sort()).toEqual([q1!.getId(), q2!.getId()].sort());
  });

  it("returns empty when input has no valid path", () => {
    const nfa = new NFA("start");

    const q1 = nfa.addState("q1");
    expect(q1).not.toBeNull();

    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    expect(nfa.addTransition(t1)).toEqual(t1);

    const result = nfa.run("b");

    expect(result.completed).toBe(false);
    expect(result.finalStateIds).toHaveLength(0);
  });

  it("accepts input when any path reaches an accepting state", () => {
    const nfa = new NFA("start");

    const q1 = nfa.addState("q1");
    const q2 = nfa.addState("q2");
    expect(q1).not.toBeNull();
    expect(q2).not.toBeNull();
    q2!.setAcceptance(true);

    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    const t2 = { from: 0, symbol: "a", to: q2!.getId() };

    expect(nfa.addTransition(t1)).toEqual(t1);
    expect(nfa.addTransition(t2)).toEqual(t2);

    expect(nfa.accepts("a")).toBe(true);
  });

  it("rejects input when no path reaches an accepting state", () => {
    const nfa = new NFA("start");

    const q1 = nfa.addState("q1");
    expect(q1).not.toBeNull();
    q1!.setAcceptance(true);

    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    expect(nfa.addTransition(t1)).toEqual(t1);

    expect(nfa.accepts("b")).toBe(false);
  });

  it("handles epsilon transitions (null symbol)", () => {
    const nfa = new NFA("start");

    const q1 = nfa.addState("q1");
    const q2 = nfa.addState("q2");
    expect(q1).not.toBeNull();
    expect(q2).not.toBeNull();
    q2!.setAcceptance(true);

    const eps = { from: 0, symbol: null, to: q1!.getId() };
    const t1 = { from: q1!.getId(), symbol: "a", to: q2!.getId() };

    expect(nfa.addTransition(eps)).toEqual(eps);
    expect(nfa.addTransition(t1)).toEqual(t1);

    expect(nfa.accepts("a")).toBe(true);
  });

  it("correctly computes epsilon closure", () => {
    const nfa = new NFA("start");

    const q1 = nfa.addState("q1");
    const q2 = nfa.addState("q2");
    expect(q1).not.toBeNull();
    expect(q2).not.toBeNull();

    const eps1 = { from: 0, symbol: null, to: q1!.getId() };
    const eps2 = { from: q1!.getId(), symbol: null, to: q2!.getId() };

    expect(nfa.addTransition(eps1)).toEqual(eps1);
    expect(nfa.addTransition(eps2)).toEqual(eps2);

    const closure = nfa.epsilonClosure([0]);
    expect(closure.sort()).toEqual([0, q1!.getId(), q2!.getId()].sort());
  });

  it("deduplicates multiple paths to the same state", () => {
    const nfa = new NFA("start");

    const q1 = nfa.addState("q1");
    const q2 = nfa.addState("q2");
    expect(q1).not.toBeNull();
    expect(q2).not.toBeNull();

    // Two different paths from start to q2
    const t1 = { from: 0, symbol: "a", to: q1!.getId() };
    const t2 = { from: 0, symbol: "a", to: q2!.getId() };
    const t3 = { from: q1!.getId(), symbol: "b", to: q2!.getId() };

    expect(nfa.addTransition(t1)).toEqual(t1);
    expect(nfa.addTransition(t2)).toEqual(t2);
    expect(nfa.addTransition(t3)).toEqual(t3);

    const result = nfa.run("ab");

    // Should reach q2 via two paths but deduplicate in result
    expect(result.completed).toBe(true);
    expect(result.finalStateIds).toContain(q2!.getId());
  });

  it("returns empty result when no start state is set", () => {
    const nfa = new NFA(null);
    nfa.setStartState(9999); // Invalid start state id

    const result = nfa.run("a");

    expect(result.completed).toBe(false);
    expect(result.finalStateIds).toHaveLength(0);
  });
});

