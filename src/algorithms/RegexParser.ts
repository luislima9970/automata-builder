import type { Token } from "./Token.js";
import { RegexTokenizer } from "./RegexTokenizer.js";
import type { SyntaxNode } from "./SyntaxNode.js";
export class RegexParser {
    private position = 0;

    private constructor(
        private readonly tokens: Token[]
    ) {}

    static parse(input: string): SyntaxNode {
        const tokens = RegexTokenizer.tokenize(input);
        const parser = new RegexParser(tokens);

        return parser.buildTree();
    }

    private buildTree(): SyntaxNode {
        const root = this.parseUnion();

        if (this.peek() !== undefined) {
            const token = this.peek()!;
            throw new Error(
                `Unexpected token "${token.type}" at position ${token.position}`
            );
        }

        return root;
    }

    private parseUnion(): SyntaxNode {
        const firstToken = this.peek();
        if (firstToken?.type === "union") {
            throw new Error(
                `Expected expression before union at position ${firstToken.position}`
            );
        }

        let left = this.parseConcat();

        while (this.peek()?.type === "union") {
            const operator = this.consume();

            if (!this.canStartPrimary(this.peek())) {
                throw new Error(
                    `Expected expression after union at position ${operator.position}`
                );
            }

            const right = this.parseConcat();
            left = { type: "union", left, right };
        }

        return left;
    }

    private parseConcat(): SyntaxNode {
        const token = this.peek();

        if (!this.canStartPrimary(token)) {
            if (token === undefined || token.type === "rparen") {
                return { type: "epsilon" };
            }

            throw new Error(
                `Expected expression at position ${token.position}`
            );
        }

        let left = this.parseRepetition();

        while (this.canStartPrimary(this.peek())) {
            const right = this.parseRepetition();
            left = { type: "concat", left, right };
        }

        return left;
    }

    private parseRepetition(): SyntaxNode {
        let node = this.parsePrimary();

        const token = this.peek();
        if (token?.type === "star" || token?.type === "plus" || token?.type === "question") {
            this.consume();
            node = { type: token.type, left: node };
        }

        const next = this.peek();
        if (next?.type === "star" || next?.type === "plus" || next?.type === "question") {
            throw new Error(
                `Consecutive repetition operators at position ${next.position}`
            );
        }

        return node;
    }

    private parsePrimary(): SyntaxNode {
        const token = this.consume();

        switch (token.type) {
            case "literal":
                if (token.value === null) {
                    throw new Error(`Literal has no value at position ${token.position}`);
                }
                return { type: "literal", symbol: token.value };

            case "epsilon":
                return { type: "epsilon" };

            case "lparen": {
                const node = this.parseUnion();
                const closing = this.peek();

                if (closing?.type !== "rparen") {
                    throw new Error(
                        `Expected closing parenthesis at position ${token.position}`
                    );
                }

                this.consume();
                return node;
            }

            default:
                throw new Error(
                    `Expected expression at position ${token.position}`
                );
        }
    }

    private peek(): Token | undefined {
        return this.tokens[this.position];
    }

    private consume(): Token {
        const token = this.peek();

        if (token === undefined) {
            throw new Error("Unexpected end of expression");
        }

        this.position++;
        return token;
    }

    private canStartPrimary(token: Token | undefined): boolean {
        return token?.type === "literal"
            || token?.type === "epsilon"
            || token?.type === "lparen";
    }
}