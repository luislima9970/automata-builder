import { describe, expect, it } from "vitest";
import { edgePath, edgeLabelPosition, selfLoopPath, selfLoopLabelPosition } from "../src/edgePath.js";

describe("edgePath", () => {
    it("creates a straight path when curvature is zero", () => {
        const path = edgePath({ x: 0, y: 0 }, { x: 100, y: 50 });

        expect(path).toBe("M 0 0 L 100 50");
    });

    it("creates a quadratic path when curvature is not zero", () => {
        const path = edgePath({ x: 0, y: 0 }, { x: 100, y: 0 }, 40);

        expect(path).toBe("M 0 0 Q 50 40 100 0");
    });

    it("places the label at the midpoint of a straight edge", () => {
        const position = edgeLabelPosition({ x: 0, y: 0 }, { x: 100, y: 50 }, 0);

        expect(position).toEqual({
            x: 50,
            y: 25
        });
    });

    it("moves the label away from a curved edge", () => {
        const position = edgeLabelPosition({ x: 0, y: 0 }, { x: 100, y: 0 }, 40);

        expect(position).toEqual({
            x: 50,
            y: 55
        });
    });

    it("does not produce NaN when two different states overlap", () => {
        const path = edgePath({ x: 100, y: 200 }, { x: 100, y: 200 }, 40);
        const labelPosition = edgeLabelPosition({ x: 100, y: 200 }, { x: 100, y: 200 }, 40);

        expect(path).toBe("M 100 200");
        expect(labelPosition).toEqual({
            x: 100,
            y: 200
        });
        expect(path).not.toContain("NaN");
    });

    it("creates a self-loop path", () => {
        const path = selfLoopPath({ x: 100, y: 100 }, 30, 40);

        expect(path).toBe("M 79 79 C 60 30 140 30 121 79");
    });

    it("places a self-loop label above the state", () => {
        const position = selfLoopLabelPosition({ x: 100, y: 100 }, 30, 40);

        expect(position).toEqual({
            x: 100,
            y: 20
        });
    });
});
