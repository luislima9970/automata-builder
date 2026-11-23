import type { SyntaxNode } from "./SyntaxNode.js";

export class SyntaxTreeSimplifier {
  static simplify(root: SyntaxNode): SyntaxNode {
    switch (root.type) {
      case "literal":
      case "epsilon":
      case "empty":
        return { ...root };

      case "concat": {
        const left = this.simplify(this.requireLeft(root));
        const right = this.simplify(this.requireRight(root));

        if (left.type === "epsilon") return right;
        if (right.type === "epsilon") return left;

        return { type: "concat", left, right };
      }

      case "union": {
        const left = this.simplify(this.requireLeft(root));
        const right = this.simplify(this.requireRight(root));

        if (this.equals(left, right)) return left;

        if (left.type === "epsilon") {
          return this.simplify({ type: "question", left: right });
        }

        if (right.type === "epsilon") {
          return this.simplify({ type: "question", left });
        }

        return { type: "union", left, right };
      }

      case "star":
      case "plus":
      case "question": {
        const left = this.simplify(this.requireLeft(root));

        if (left.type === "epsilon") return left;

        if (left.type === root.type) return left;

        if (left.type === "star") return left;

        if (
          root.type === "star" &&
          (left.type === "plus" || left.type === "question")
        ) {
          return this.simplify({
            type: "star",
            left: this.requireLeft(left),
          });
        }

        if (
          (root.type === "plus" && left.type === "question") ||
          (root.type === "question" && left.type === "plus")
        ) {
          return this.simplify({
            type: "star",
            left: this.requireLeft(left),
          });
        }

        return { type: root.type, left };
      }

      default:
        throw new Error(`Unknown syntax node type: ${root.type}`);
    }
  }

  private static equals(
    left: SyntaxNode | undefined,
    right: SyntaxNode | undefined,
  ): boolean {
    if (left === undefined || right === undefined) {
      return left === right;
    }

    return (
      left.type === right.type &&
      left.symbol === right.symbol &&
      this.equals(left.left, right.left) &&
      this.equals(left.right, right.right)
    );
  }

  private static requireLeft(node: SyntaxNode): SyntaxNode {
    if (node.left === undefined) {
      throw new Error(`${node.type} requires a left child`);
    }

    return node.left;
  }

  private static requireRight(node: SyntaxNode): SyntaxNode {
    if (node.right === undefined) {
      throw new Error(`${node.type} requires a right child`);
    }

    return node.right;
  }
}

