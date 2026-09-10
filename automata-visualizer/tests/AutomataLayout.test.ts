import { describe, expect, it } from "vitest";
import { DFA } from "../../automata-lib/src/core/DFA.js";
import { NFA } from "../../automata-lib/src/core/NFA.js";
import { AutomataLayout } from "../src/AutomataLayout.js";

describe("AutomataLayout", () => {
    it("creates an initial position for every state", () => {
        const dfa = new DFA("s");
        const q1 = dfa.addState("q1");
        const layout = new AutomataLayout(dfa);

        expect(q1).not.toBeNull();
        expect(layout.getPosition(0)).toEqual({
            x: 150,
            y: 200
        });
        expect(layout.getPosition(q1!.getId())).toEqual({
            x: 330,
            y: 200
        });
    });

    it("creates a position for a state added after construction", () => {
        const dfa = new DFA("s");
        const layout = new AutomataLayout(dfa);
        const q1 = dfa.addState("q1");

        expect(q1).not.toBeNull();
        expect(layout.getPosition(q1!.getId())).toBeUndefined();

        layout.sync();

        expect(layout.getPosition(q1!.getId())).toEqual({
            x: 330,
            y: 200
        });
    });

    it("removes the position of a deleted state during synchronization", () => {
        const dfa = new DFA("s");
        const q1 = dfa.addState("q1");
        const layout = new AutomataLayout(dfa);

        expect(q1).not.toBeNull();
        expect(layout.getPosition(q1!.getId())).toBeDefined();

        expect(dfa.removeState(q1!.getId())).toBe(true);
        layout.sync();

        expect(layout.getPosition(q1!.getId())).toBeUndefined();
    });

    it("allows changing the position of an existing state", () => {
        const dfa = new DFA("s");
        const layout = new AutomataLayout(dfa);

        expect(layout.setPosition(0, { x: 500, y: 300 })).toBe(true);
        expect(layout.getPosition(0)).toEqual({
            x: 500,
            y: 300
        });
    });

    it("rejects changing the position of a nonexistent state", () => {
        const dfa = new DFA("s");
        const layout = new AutomataLayout(dfa);

        expect(layout.setPosition(999, { x: 100, y: 100 })).toBe(false);
    });

    it("groups transitions with the same endpoints into one visual edge", () => {
        const nfa = new NFA("s");
        const q1 = nfa.addState("q1");

        expect(q1).not.toBeNull();

        nfa.addTransition({
            from: 0,
            to: q1!.getId(),
            symbol: "a"
        });

        nfa.addTransition({
            from: 0,
            to: q1!.getId(),
            symbol: "b"
        });

        const layout = new AutomataLayout(nfa);
        const geometries = layout.getEdgeGeometries();

        expect(geometries).toHaveLength(1);
        expect(geometries[0]!.label).toBe("a, b");
    });

    it("removes duplicate symbols from the visual label", () => {
        const nfa = new NFA("s");
        const q1 = nfa.addState("q1");

        expect(q1).not.toBeNull();

        nfa.addTransition({
            from: 0,
            to: q1!.getId(),
            symbol: "a"
        });

        nfa.addTransition({
            from: 0,
            to: q1!.getId(),
            symbol: "a"
        });

        const layout = new AutomataLayout(nfa);
        const geometries = layout.getEdgeGeometries();

        expect(geometries).toHaveLength(1);
        expect(geometries[0]!.label).toBe("a");
    });

    it("renders epsilon as the epsilon symbol", () => {
        const nfa = new NFA("s");
        const q1 = nfa.addState("q1");

        expect(q1).not.toBeNull();

        nfa.addTransition({
            from: 0,
            to: q1!.getId(),
            symbol: null
        });

        const layout = new AutomataLayout(nfa);
        const geometries = layout.getEdgeGeometries();

        expect(geometries[0]!.label).toBe("ε");
    });

    it("keeps opposite transitions as separate visual edges", () => {
        const dfa = new DFA("s");
        const q1 = dfa.addState("q1");

        expect(q1).not.toBeNull();

        dfa.addTransition({
            from: 0,
            to: q1!.getId(),
            symbol: "a"
        });

        dfa.addTransition({
            from: q1!.getId(),
            to: 0,
            symbol: "b"
        });

        const layout = new AutomataLayout(dfa);

        expect(layout.getEdgeGeometries()).toHaveLength(2);
    });

    it("preserves curvature after synchronization", () => {
        const dfa = new DFA("s");
        const q1 = dfa.addState("q1");

        expect(q1).not.toBeNull();

        dfa.addTransition({
            from: 0,
            to: q1!.getId(),
            symbol: "a"
        });

        const layout = new AutomataLayout(dfa);

        expect(layout.setCurvature(0, q1!.getId(), 40)).toBe(true);

        const pathBeforeSync = layout.getEdgeGeometries()[0]!.path;

        layout.sync();

        const pathAfterSync = layout.getEdgeGeometries()[0]!.path;

        expect(pathBeforeSync).toContain("Q");
        expect(pathAfterSync).toBe(pathBeforeSync);
    });

    it("rejects changing curvature for a nonexistent visual edge", () => {
        const dfa = new DFA("s");
        const layout = new AutomataLayout(dfa);

        expect(layout.setCurvature(0, 99, 40)).toBe(false);
    });

    it("creates self-loop geometry", () => {
        const dfa = new DFA("s");

        dfa.addTransition({
            from: 0,
            to: 0,
            symbol: "a"
        });

        const layout = new AutomataLayout(dfa);
        const geometry = layout.getEdgeGeometries()[0]!;

        expect(geometry.path).toContain("C");
        expect(geometry.label).toBe("a");
    });

    it("changes edge geometry when a state moves", () => {
        const dfa = new DFA("s");
        const q1 = dfa.addState("q1");

        expect(q1).not.toBeNull();

        dfa.addTransition({
            from: 0,
            to: q1!.getId(),
            symbol: "a"
        });

        const layout = new AutomataLayout(dfa);
        const originalPath = layout.getEdgeGeometries()[0]!.path;

        layout.setPosition(q1!.getId(), {
            x: 500,
            y: 400
        });

        const newPath = layout.getEdgeGeometries()[0]!.path;

        expect(newPath).not.toBe(originalPath);
    });

    it("does not generate NaN geometry for overlapping states", () => {
        const dfa = new DFA("s");
        const q1 = dfa.addState("q1");

        expect(q1).not.toBeNull();

        dfa.addTransition({
            from: 0,
            to: q1!.getId(),
            symbol: "a"
        });

        const layout = new AutomataLayout(dfa);
        const startPosition = layout.getPosition(0)!;

        layout.setPosition(q1!.getId(), startPosition);
        layout.setCurvature(0, q1!.getId(), 40);

        const geometry = layout.getEdgeGeometries()[0]!;

        expect(geometry.path).not.toContain("NaN");
        expect(geometry.labelPosition.x).not.toBeNaN();
        expect(geometry.labelPosition.y).not.toBeNaN();
    });
});
