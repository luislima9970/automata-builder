import { describe, expect, it } from "vitest";
import { NFABuilder } from "../../src/algorithms/NFABuilder.js";
import { RegexParser } from "../../src/algorithms/RegexParser.js";

describe("NFABuilder", () => {
  it("builds a literal expression", () => {
    const nfa = NFABuilder.build(RegexParser.parse("a"));

    expect(nfa.accepts("a")).toBe(true);
    expect(nfa.accepts("")).toBe(false);
    expect(nfa.accepts("b")).toBe(false);
  });

  it("builds concatenation", () => {
    const nfa = NFABuilder.build(RegexParser.parse("ab"));

    expect(nfa.accepts("ab")).toBe(true);
    expect(nfa.accepts("a")).toBe(false);
    expect(nfa.accepts("b")).toBe(false);
  });

  it("builds union", () => {
    const nfa = NFABuilder.build(RegexParser.parse("a|b"));

    expect(nfa.accepts("a")).toBe(true);
    expect(nfa.accepts("b")).toBe(true);
    expect(nfa.accepts("ab")).toBe(false);
  });

  it("builds and applies a complex grouped expression", () => {
    const nfa = NFABuilder.buildRegex("(a|b)*abb");

    expect(nfa.accepts("abb")).toBe(true);
    expect(nfa.accepts("aabb")).toBe(true);
    expect(nfa.accepts("bababb")).toBe(true);
    expect(nfa.accepts("")).toBe(false);
    expect(nfa.accepts("ab")).toBe(false);
    expect(nfa.accepts("ababa")).toBe(false);
  });

  it("builds star, plus, and question expressions", () => {
    expect(NFABuilder.buildRegex("a*").accepts("")).toBe(true);
    expect(NFABuilder.buildRegex("a*").accepts("aaa")).toBe(true);
    expect(NFABuilder.buildRegex("a+").accepts("")).toBe(false);
    expect(NFABuilder.buildRegex("a+").accepts("aa")).toBe(true);
    expect(NFABuilder.buildRegex("a?").accepts("")).toBe(true);
    expect(NFABuilder.buildRegex("a?").accepts("a")).toBe(true);
  });

  it("removes the temporary state and keeps the fragment start as start state", () => {
    const nfa = NFABuilder.buildRegex("a");

    expect(nfa.getStartStateId()).not.toBe(0);
    expect(nfa.getState(0)).toBeNull();
  });
});