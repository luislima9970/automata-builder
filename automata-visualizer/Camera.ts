import type { Position } from './Position.js';

export class Camera {

    topLeft : Position = { x: 0, y: 0 };

    zoom : number;
    pixelWidth: number;
    pixelHeight: number;

    private static readonly MIN_ZOOM = 0.1;
    private static readonly MAX_ZOOM = 5;

    constructor(x = 0,y = 0,zoom = 1,pixelWidth = 800, pixelHeight = 600){

        this.topLeft.x = x;
        this.topLeft.y = y;
        this.zoom = zoom;
        this.pixelHeight = pixelHeight;
        this.pixelWidth = pixelWidth;


    }

    get viewBoxString(): string {
        return `${this.topLeft.x} ${this.topLeft.y} ${this.pixelWidth / this.zoom} ${this.pixelHeight / this.zoom}`;
    }


    pan(dx: number, dy : number) : void {
        
        this.topLeft.x -= (dx / this.pixelWidth) * (this.pixelWidth / this.zoom);
        this.topLeft.y -= (dy / this.pixelHeight) * (this.pixelHeight / this.zoom);

    }

    zoomAt(screenX: number, screenY: number, factor: number): void {
        const viewBoxWidth = this.pixelWidth / this.zoom;
        const viewBoxHeight = this.pixelHeight / this.zoom;

        const worldX = this.topLeft.x + (screenX / this.pixelWidth) * viewBoxWidth;
        const worldY = this.topLeft.y + (screenY / this.pixelHeight) * viewBoxHeight;

        const newZoom = Camera.clamp(this.zoom * factor, Camera.MIN_ZOOM, Camera.MAX_ZOOM);

        const newViewBoxWidth = this.pixelWidth / newZoom;
        const newViewBoxHeight = this.pixelHeight / newZoom;

        this.zoom = newZoom;
        this.topLeft.x = worldX - (screenX / this.pixelWidth) * newViewBoxWidth;
        this.topLeft.y = worldY - (screenY / this.pixelHeight) * newViewBoxHeight;
  }

  private static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }


}


