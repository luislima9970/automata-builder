import { describe, expect, it } from "vitest";
import { RegexTokenizer } from "../../src/algorithms/RegexTokenizer.js";

describe("RegexTokenizer", () => {
  it("tokenizes literals and records their positions", () => {
      expect(RegexTokenizer.tokenize("abc")).toEqual([
      { type: "literal", value: "a", position: 0 },
      { type: "literal", value: "b", position: 1 },
      { type: "literal", value: "c", position: 2 },
    ]);
  });

  it("tokenizes every supported operator and delimiter", () => {
      expect(RegexTokenizer.tokenize("|*+?()")).toEqual([
      { type: "union", value: null, position: 0 },
      { type: "star", value: null, position: 1 },
      { type: "plus", value: null, position: 2 },
      { type: "question", value: null, position: 3 },
      { type: "lparen", value: null, position: 4 },
      { type: "rparen", value: null, position: 5 },
    ]);
  });

  it("tokenizes escaped epsilon and escaped characters", () => {
      expect(RegexTokenizer.tokenize(String.raw`\e\|\*\\\?`)).toEqual([
      { type: "epsilon", value: null, position: 0 },
      { type: "literal", value: "|", position: 2 },
      { type: "literal", value: "*", position: 4 },
      { type: "literal", value: "\\", position: 6 },
      { type: "literal", value: "?", position: 8 },
    ]);
  });

  it("returns no tokens for empty input", () => {
      expect(RegexTokenizer.tokenize("")).toEqual([]);
  });

  it("rejects an incomplete escape", () => {
      expect(() => RegexTokenizer.tokenize("abc\\")).toThrow(
      "Incomplete escape at position 3",
    );
  });
});
