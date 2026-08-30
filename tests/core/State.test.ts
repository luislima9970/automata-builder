import { describe, expect, it } from "vitest";
import { State } from "../../src/core/State.js";

describe("State", () => {
  it("creates a non-accepting state by default", () => {
    const state = new State(7);

    expect(state.getId()).toBe(7);
    expect(state.getAcceptance()).toBe(false);
  });

  it("allows setting acceptance explicitly", () => {
    const state = new State(3, false);

    state.setAcceptance(true);

    expect(state.getAcceptance()).toBe(true);
  });

  it("toggles acceptance state", () => {
    const state = new State(2);

    state.toggleAcceptance();
    expect(state.getAcceptance()).toBe(true);

    state.toggleAcceptance();
    expect(state.getAcceptance()).toBe(false);
  });
});
