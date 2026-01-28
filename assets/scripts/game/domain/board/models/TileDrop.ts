import { TilePosition } from "./TilePosition";

export interface TileDrop {
    readonly from: TilePosition;
    readonly to: TilePosition;
}