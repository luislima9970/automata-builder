import { describe, expect, it } from "vitest";
import { Camera } from "../src/Camera.js";

describe("Camera", () => {
    it("creates the default viewBox", () => {
        const camera = new Camera();

        expect(camera.viewBoxString).toBe("0 0 800 600");
    });

    it("creates a viewBox using the provided values", () => {
        const camera = new Camera(100, 50, 2, 800, 600);

        expect(camera.viewBoxString).toBe("100 50 400 300");
    });

    it("pans at normal zoom", () => {
        const camera = new Camera();

        camera.pan(100, 50);

        expect(camera.topLeft).toEqual({
            x: -100,
            y: -50
        });
    });

    it("takes zoom into account while panning", () => {
        const camera = new Camera(0, 0, 2);

        camera.pan(100, 50);

        expect(camera.topLeft).toEqual({
            x: -50,
            y: -25
        });
    });

    it("zooms around the center of the screen", () => {
        const camera = new Camera(0, 0, 1, 800, 600);

        camera.zoomAt(400, 300, 2);

        expect(camera.zoom).toBe(2);
        expect(camera.topLeft).toEqual({
            x: 200,
            y: 150
        });
        expect(camera.viewBoxString).toBe("200 150 400 300");
    });

    it("does not move the top-left point when zooming there", () => {
        const camera = new Camera(100, 50, 1, 800, 600);

        camera.zoomAt(0, 0, 2);

        expect(camera.topLeft).toEqual({
            x: 100,
            y: 50
        });
    });

    it("limits maximum zoom", () => {
        const camera = new Camera();

        camera.zoomAt(0, 0, 100);

        expect(camera.zoom).toBe(5);
    });

    it("limits minimum zoom", () => {
        const camera = new Camera();

        camera.zoomAt(0, 0, 0.0001);

        expect(camera.zoom).toBe(0.1);
    });
});
