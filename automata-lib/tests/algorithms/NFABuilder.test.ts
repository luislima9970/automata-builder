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

  it("builds a standalone epsilon expression", () => {
    const nfa = NFABuilder.buildRegex("\\e");

    expect(nfa.accepts("")).toBe(true);
    expect(nfa.accepts("a")).toBe(false);
  });

  it("builds epsilon inside concatenation and union", () => {
    const concatenation = NFABuilder.buildRegex("a\\eb");
    const union = NFABuilder.buildRegex("a|\\e");

    expect(concatenation.accepts("ab")).toBe(true);
    expect(concatenation.accepts("a")).toBe(false);
    expect(union.accepts("")).toBe(true);
    expect(union.accepts("a")).toBe(true);
    expect(union.accepts("b")).toBe(false);
  });

  it("builds repetition of an expression containing epsilon", () => {
    const nfa = NFABuilder.buildRegex("(a|\\e)*");

    expect(nfa.accepts("")).toBe(true);
    expect(nfa.accepts("a")).toBe(true);
    expect(nfa.accepts("aaa")).toBe(true);
    expect(nfa.accepts("b")).toBe(false);
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

  it("builds nested repetition with an optional suffix", () => {
    const nfa = NFABuilder.buildRegex("(ab|c)+d?");

    expect(nfa.accepts("ab")).toBe(true);
    expect(nfa.accepts("abcd")).toBe(true);
    expect(nfa.accepts("cabcdd")).toBe(false);
    expect(nfa.accepts("a")).toBe(false);
  });

  it("builds a union of repeated grouped expressions", () => {
    const nfa = NFABuilder.buildRegex("((a|b)c)*|d+");

    expect(nfa.accepts("")).toBe(true);
    expect(nfa.accepts("acbc")).toBe(true);
    expect(nfa.accepts("ddd")).toBe(true);
    expect(nfa.accepts("ab")).toBe(false);
    expect(nfa.accepts("dc")).toBe(false);
  });



  it("builds epsilon in a nested expression with multiple operators", () => {
    const nfa = NFABuilder.buildRegex("(a\\e|bc?)+");

    expect(nfa.accepts("a")).toBe(true);
    expect(nfa.accepts("ab")).toBe(true);
    expect(nfa.accepts("bcc")).toBe(false);
    expect(nfa.accepts("")).toBe(false);
    expect(nfa.accepts("abc")).toBe(true);
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