import { describe, expect, it } from "vitest";
import { NFABuilder } from "../../src/algorithms/NFABuilder.js";
import { RegexParser } from "../../src/algorithms/RegexParser.js";

describe("NFABuilder", () => {
  const builder = new NFABuilder();

  it("builds a literal expression", () => {
    const nfa = builder.build(RegexParser.parse("a"));

    expect(nfa.accepts("a")).toBe(true);
    expect(nfa.accepts("")).toBe(false);
    expect(nfa.accepts("b")).toBe(false);
  });

  it("builds concatenation", () => {
    const nfa = builder.build(RegexParser.parse("ab"));

    expect(nfa.accepts("ab")).toBe(true);
    expect(nfa.accepts("a")).toBe(false);
    expect(nfa.accepts("b")).toBe(false);
  });

  it("builds union", () => {
    const nfa = builder.build(RegexParser.parse("a|b"));

    expect(nfa.accepts("a")).toBe(true);
    expect(nfa.accepts("b")).toBe(true);
    expect(nfa.accepts("ab")).toBe(false);
  });

  it("builds and applies a complex grouped expression", () => {
    const nfa = builder.build(RegexParser.parse("(a|b)*abb"));

    expect(nfa.accepts("abb")).toBe(true);
    expect(nfa.accepts("aabb")).toBe(true);
    expect(nfa.accepts("bababb")).toBe(true);
    expect(nfa.accepts("")).toBe(false);
    expect(nfa.accepts("ab")).toBe(false);
    expect(nfa.accepts("ababa")).toBe(false);
  });

  it("builds star, plus, and question expressions", () => {
    expect(builder.build(RegexParser.parse("a*" )).accepts("")).toBe(true);
    expect(builder.build(RegexParser.parse("a*" )).accepts("aaa")).toBe(true);
    expect(builder.build(RegexParser.parse("a+" )).accepts("")).toBe(false);
    expect(builder.build(RegexParser.parse("a+" )).accepts("aa")).toBe(true);
    expect(builder.build(RegexParser.parse("a?" )).accepts("")).toBe(true);
    expect(builder.build(RegexParser.parse("a?" )).accepts("a")).toBe(true);
  });

  it("removes the temporary state and keeps the fragment start as start state", () => {
    const nfa = builder.build(RegexParser.parse("a"));

    expect(nfa.getStartStateId()).not.toBe(0);
    expect(nfa.getState(0)).toBeNull();
  });
});