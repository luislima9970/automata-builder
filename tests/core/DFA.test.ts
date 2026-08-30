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
});
