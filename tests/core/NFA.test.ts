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
    expect(transitions.map((t) => t.to).sort((a, b) => a - b)).toEqual(
      [q1!.getId(), q2!.getId()].sort((a, b) => a - b),
    );
    expect(nfa.nextStates([0], "a").sort((a, b) => a - b)).toEqual(
      [q1!.getId(), q2!.getId()].sort((a, b) => a - b),
    );
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
    expect(result.finalStateIds.sort((a, b) => a - b)).toEqual(
      [q1!.getId(), q2!.getId()].sort((a, b) => a - b),
    );
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
    expect(closure.sort((a, b) => a - b)).toEqual(
      [0, q1!.getId(), q2!.getId()].sort((a, b) => a - b),
    );
  });

  it("deduplicates multiple paths reaching the same state", () => {
    const nfa = new NFA("start");

    const q1 = nfa.addState("q1")!;
    const q2 = nfa.addState("q2")!;
    const q3 = nfa.addState("q3")!;

    nfa.addTransition({ from: 0, symbol: "a", to: q1.getId() });
    nfa.addTransition({ from: 0, symbol: "a", to: q2.getId() });
    nfa.addTransition({ from: q1.getId(), symbol: "b", to: q3.getId() });
    nfa.addTransition({ from: q2.getId(), symbol: "b", to: q3.getId() });

    const result = nfa.run("ab");

    expect(result.completed).toBe(true);
    expect(result.finalStateIds).toEqual([q3.getId()]);
  });

  it("accepts empty input through epsilon transitions", () => {
    const nfa = new NFA("start");
    const accepting = nfa.addState("accepting")!;
    accepting.setAcceptance(true);

    nfa.addTransition({
      from: 0,
      symbol: null,
      to: accepting.getId(),
    });

    expect(nfa.accepts("")).toBe(true);
  });

  it("handles cycles in epsilon closure", () => {
    const nfa = new NFA("start");
    const q1 = nfa.addState("q1")!;

    nfa.addTransition({ from: 0, symbol: null, to: q1.getId() });
    nfa.addTransition({ from: q1.getId(), symbol: null, to: 0 });

    expect(nfa.epsilonClosure([0]).sort((a, b) => a - b)).toEqual(
      [0, q1.getId()].sort((a, b) => a - b),
    );
  });
});

