import { describe, expect, it } from "vitest";
import { RegexParser } from "../../src/algorithms/RegexParser.js";
import { NFABuilder } from "../../src/algorithms/NFABuilder.js";
import { SyntaxTreeSimplifier } from "../../src/algorithms/SyntaxTreeSimplifier.js";

function simplify(regex: string) {
  return SyntaxTreeSimplifier.simplify(RegexParser.parse(regex));
}

function wordsUpTo(maxLength: number): string[] {
  const words = [""];
  let level = [""];

  for (let length = 1; length <= maxLength; length++) {
    level = level.flatMap((prefix) => [
      `${prefix}a`,
      `${prefix}b`,
    ]);

    words.push(...level);
  }

  return words;
}

describe("SyntaxTreeSimplifier", () => {
  it.each([
    ["a", "a"],
    ["", ""],
    ["\\ea", "a"],
    ["a\\e", "a"],
    ["a|a", "a"],
    ["ab|ab", "ab"],
    ["(a*)*", "a*"],
    ["(a+)+", "a+"],
    ["(a?)?", "a?"],
    ["\\e*", ""],
    ["\\e+", ""],
    ["\\e?", ""],
    ["a|\\e", "a?"],
    ["\\e|a", "a?"],
    ["(a+)*", "a*"],
    ["(a?)*", "a*"],
    ["(a*)+", "a*"],
    ["(a*)?", "a*"],
    ["(a?)+", "a*"],
    ["(a+)?", "a*"],
    ["((a|a)\\e)*", "a*"],
  ])("simplifies %s to %s", (input, expected) => {
    expect(simplify(input)).toEqual(RegexParser.parse(expected));
  });

  it("preserves distinct alternatives", () => {
    expect(simplify("a|b")).toEqual(RegexParser.parse("a|b"));
  });

  it("preserves concatenation order", () => {
    expect(simplify("ba")).toEqual(RegexParser.parse("ba"));
  });

  it("does not mutate the original tree", () => {
    const root = RegexParser.parse("(a|a)\\e");
    const original = structuredClone(root);

    SyntaxTreeSimplifier.simplify(root);

    expect(root).toEqual(original);
  });

  it("is idempotent", () => {
    const once = simplify("(((a|a)\\e)+)?");

    expect(SyntaxTreeSimplifier.simplify(once)).toEqual(once);
  });

  it.each([
    "\\ea",
    "a\\e",
    "ab|ab",
    "(a*)*",
    "(a+)+",
    "(a?)?",
    "a|\\e",
    "(a+)*",
    "(a?)*",
    "(a*)+",
    "(a*)?",
    "(a?)+",
    "(a+)?",
    "((a|a)\\e)*",
  ])("preserves acceptance for %s", (regex) => {
    const root = RegexParser.parse(regex);
    const original = NFABuilder.build(root);
    const simplified = NFABuilder.build(
      SyntaxTreeSimplifier.simplify(root),
    );

    for (const word of wordsUpTo(4)) {
      expect(
        simplified.accepts(word),
        `Regex: ${regex}, input: ${JSON.stringify(word)}`,
      ).toBe(original.accepts(word));
    }
  });

  it("reduces generated states for redundant expressions", () => {
    const root = RegexParser.parse("(a|a)\\e");
    const original = NFABuilder.build(root);
    const simplified = NFABuilder.build(
      SyntaxTreeSimplifier.simplify(root),
    );

    expect(simplified.getStates().length).toBeLessThan(
      original.getStates().length,
    );
  });
});

