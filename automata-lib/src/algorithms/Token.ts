import type { TokenType } from "./TokenType.js";

export interface Token {
    type: TokenType;
    value: string | null;
    position: number;
}