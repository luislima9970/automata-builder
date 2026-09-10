import { describe, expect, it } from "vitest";
import { Automata } from "../../src/core/Automata.js";

describe("Automata", () => {
  it("creates an initial state with the provided default name", () => {
    const automata = new Automata("start");

    expect(automata.getStates()).toHaveLength(1);
    expect(automata.getStates()[0].getId()).toBe(0);
    expect(automata.getStateName(0)).toBe("start");
  });

  it("adds a state with a unique name", () => {
    const automata = new Automata("start");

    const state = automata.addState("q1");

    expect(state).not.toBeNull();
    expect(state?.getId()).toBe(1);
    expect(automata.getStateName(1)).toBe("q1");
  });

  it("generates a unique name when adding a state without one", () => {
    const automata = new Automata("start");

    const first = automata.addState();
    const second = automata.addState();

    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(automata.getStateName(first!.getId())).toBe("q1");
    expect(automata.getStateName(second!.getId())).toBe("q2");
  });

  it("keeps the initial state name from the constructor without a separate automaton name", () => {
    const automata = new Automata("start");

    expect(automata.getStateName(0)).toBe("start");
  });

  it("gets a state by id and marks it as accepting", () => {
    const automata = new Automata("start");
    const state = automata.addState("q1");

    expect(automata.getState(state!.getId())).toBe(state);
    expect(automata.setStateAcceptance(state!.getId())).toBe(true);
    expect(state!.getAcceptance()).toBe(true);
  });

  it("returns null and false for an unknown state id", () => {
    const automata = new Automata("start");

    expect(automata.getState(999)).toBeNull();
    expect(automata.setStateAcceptance(999)).toBe(false);
  });

  it("rejects duplicate state names", () => {
    const automata = new Automata("start");

    expect(automata.addState("start")).toBeNull();
  });

  it("adds a valid transition between existing states", () => {
    const automata = new Automata("start");
    const q1 = automata.addState("q1");

    const transition = { from: 0, symbol: "a", to: q1!.getId() };

    const added = automata.addTransition(transition);

    expect(added).toMatchObject(transition);
    expect(added?.id).toBeDefined();
    expect(automata.getTransitions()).toHaveLength(1);
  });

  it("rejects transitions when either state does not exist", () => {
    const automata = new Automata("start");

    expect(automata.addTransition({ from: 0, symbol: "a", to: 99 })).toBeNull();
    expect(automata.addTransition({ from: 99, symbol: "a", to: 0 })).toBeNull();
  });

  it("removes a transition by object or id", () => {
    const automata = new Automata("start");
    const q1 = automata.addState("q1");
    const transition = { from: 0, symbol: "a", to: q1!.getId() };

    const added = automata.addTransition(transition);
    expect(added).not.toBeNull();

    expect(automata.removeTransition(added!)).toBe(true);
    expect(automata.getTransitions()).toHaveLength(0);

    const second = automata.addTransition({ from: 0, symbol: "b", to: q1!.getId() });
    expect(automata.removeTransition(second!.id!)).toBe(true);
    expect(automata.getTransitions()).toHaveLength(0);
  });

  it("updates the start state when a valid state is selected", () => {
    const automata = new Automata("start");
    const q1 = automata.addState("q1");

    automata.setStartState(q1!.getId());

    expect(automata.getStartStateId()).toBe(q1!.getId());
  });

  it("ignores invalid start-state changes", () => {
    const automata = new Automata("start");

    automata.setStartState(999);

    expect(automata.getStartStateId()).toBe(0);
  });

  it("does not remove the current start state", () => {
    const automata = new Automata("start");

    expect(automata.removeState(0)).toBe(false);
    expect(automata.getStates()).toHaveLength(1);
    expect(automata.getStartStateId()).toBe(0);
  });
});
