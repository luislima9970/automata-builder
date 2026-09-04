import type { SyntaxNodeType } from "./SyntaxNodeType.js";

export interface SyntaxNode {
	type: SyntaxNodeType;
	symbol?: string;
	left?: SyntaxNode;
	right?: SyntaxNode;
}
