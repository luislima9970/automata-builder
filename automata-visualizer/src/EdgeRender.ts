import { EdgeGeometry } from "./EdgeGeometry";



export interface EdgeRender {
    fromId: number;
    toId: number;
    geometry: EdgeGeometry;
}
