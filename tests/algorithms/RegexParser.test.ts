import { describe, expect, it } from "vitest";
import { RegexParser } from "../../src/algorithms/RegexParser.js";

describe("RegexParser", () => {
  it("parses a literal", () => {
    expect(RegexParser.parse("a")).toEqual({
      type: "literal",
      symbol: "a",
    });
  });

  it("preserves union and concatenation precedence", () => {
    expect(RegexParser.parse("ab|c")).toEqual({
      type: "union",
      left: {
        type: "concat",
        left: { type: "literal", symbol: "a" },
        right: { type: "literal", symbol: "b" },
      },
      right: { type: "literal", symbol: "c" },
    });
  });

  it("parses grouped expressions and repetition operators", () => {
    expect(RegexParser.parse("(a|b)*")).toEqual({
      type: "star",
      left: {
        type: "union",
        left: { type: "literal", symbol: "a" },
        right: { type: "literal", symbol: "b" },
      },
    });
  });

  it("parses epsilon and empty expressions", () => {
    expect(RegexParser.parse("\\e")).toEqual({ type: "epsilon" });
    expect(RegexParser.parse("")).toEqual({ type: "epsilon" });
    expect(RegexParser.parse("()")).toEqual({ type: "epsilon" });
  });

  it("distinguishes escaped operators from operators", () => {
    expect(RegexParser.parse("\\+")).toEqual({
      type: "literal",
      symbol: "+",
    });

    expect(RegexParser.parse("\\?")).toEqual({
      type: "literal",
      symbol: "?",
    });
  });

  it("gives repetition greater precedence than concatenation", () => {
    expect(RegexParser.parse("ab*")).toEqual({
      type: "concat",
      left: { type: "literal", symbol: "a" },
      right: {
        type: "star",
        left: { type: "literal", symbol: "b" },
      },
    });
  });

  it("rejects malformed expressions", () => {
    expect(() => RegexParser.parse("|a")).toThrow();
    expect(() => RegexParser.parse("a|")).toThrow();
    expect(() => RegexParser.parse("*a")).toThrow();
    expect(() => RegexParser.parse("+a")).toThrow();
    expect(() => RegexParser.parse("?a")).toThrow();
    expect(() => RegexParser.parse("a||b")).toThrow();
    expect(() => RegexParser.parse("a**")).toThrow();
    expect(() => RegexParser.parse("(a")).toThrow();
    expect(() => RegexParser.parse("a)")).toThrow();
    expect(() => RegexParser.parse("\\")).toThrow();
  });
});
