import { TilePosition } from "./TilePosition";

export interface TileMove {
    readonly from: TilePosition;
    readonly to: TilePosition;
}