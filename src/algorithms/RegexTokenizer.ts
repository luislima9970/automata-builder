import type { Token } from "./Token.js";

export class RegexTokenizer {
    tokenize(input: string): Token[] {
        const tokens: Token[] = [];
        let position = 0;

        while (position < input.length) {
            const char = input[position]!;

            // Handle escaped characters
            if (char === "\\") {
                const next = input[position + 1];

                if (next === undefined) {
                    throw new Error(
                        `Incomplete escape at position ${position}`
                    );
                }

                if (next === "e") {
                    tokens.push({
                        type: "epsilon",
                        value: null,
                        position
                    });
                } else {
                    tokens.push({
                        type: "literal",
                        value: next,
                        position
                    });
                }

                position += 2;
                continue;
            }

            switch (char) {
                case "|":
                    tokens.push({ type: "union", value: null, position });
                    break;

                case "*":
                    tokens.push({ type: "star", value: null, position });
                    break;

                case "+":
                    tokens.push({ type: "plus", value: null, position });
                    break;

                case "?":
                    tokens.push({ type: "question", value: null, position });
                    break;

                case "(":
                    tokens.push({ type: "lparen", value: null, position });
                    break;

                case ")":
                    tokens.push({ type: "rparen", value: null, position });
                    break;

                default:
                    tokens.push({ type: "literal", value: char, position });
                    break;
            }

            position++;
        }

        return tokens;
    }
}