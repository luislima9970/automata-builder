import { describe, expect, it } from "vitest";
import { DFA } from "../../src/core/DFA.js";
import { NFA } from "../../src/core/NFA.js";
import { AutomataSerializer } from "../../src/serializers/AutomataSerializer.js";

describe("AutomataSerializer", () => {
  it("round-trips a DFA without losing acceptance or transitions", () => {
    const dfa = new DFA("demo");
    const q1 = dfa.addState("q1");

    expect(q1).not.toBeNull();

    q1!.setAcceptance(true);
    expect(dfa.addTransition({ from: 0, symbol: "a", to: q1!.getId() })).toMatchObject({
      from: 0,
      symbol: "a",
      to: q1!.getId(),
    });

    const json = AutomataSerializer.serialize(dfa);
    const restored = AutomataSerializer.fromObject(JSON.parse(json));

    expect(restored).toBeInstanceOf(DFA);
    expect(restored.accepts("a")).toBe(true);
    expect(restored.getTransitions()).toHaveLength(1);
    expect(restored.getStartStateId()).toBe(0);
  });

  it("round-trips an NFA with epsilon transitions", () => {
    const nfa = new NFA("demo");
    const q1 = nfa.addState("q1");
    const q2 = nfa.addState("q2");

    expect(q1).not.toBeNull();
    expect(q2).not.toBeNull();

    q2!.setAcceptance(true);
    expect(nfa.addTransition({ from: 0, symbol: null, to: q1!.getId() })).toMatchObject({
      from: 0,
      symbol: null,
      to: q1!.getId(),
    });
    expect(nfa.addTransition({ from: q1!.getId(), symbol: "a", to: q2!.getId() })).toMatchObject({
      from: q1!.getId(),
      symbol: "a",
      to: q2!.getId(),
    });

    const json = AutomataSerializer.serialize(nfa);
    const restored = AutomataSerializer.fromObject(JSON.parse(json));

    expect(restored).toBeInstanceOf(NFA);
    expect(restored.accepts("a")).toBe(true);
    expect(restored.getTransitions()).toHaveLength(2);
  });
});
