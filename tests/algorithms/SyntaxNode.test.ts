import { describe, expect, it } from "vitest";
import type { SyntaxNode } from "../../src/algorithms/SyntaxNode.js";

describe("SyntaxNode", () => {
  it("represents a literal node", () => {
    const node: SyntaxNode = {
      type: "literal",
      symbol: "a",
    };

    expect(node).toEqual({
      type: "literal",
      symbol: "a",
    });
  });

  it("supports recursive expression trees", () => {
    const tree: SyntaxNode = {
      type: "union",
      left: { type: "literal", symbol: "a" },
      right: {
        type: "star",
        left: { type: "epsilon" },
      },
    };

    expect(tree.left?.type).toBe("literal");
    expect(tree.right?.left?.type).toBe("epsilon");
  });
});
