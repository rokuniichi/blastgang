import { TilePosition } from "../../models/board/TilePosition";

export interface TileDrop {
    readonly from: TilePosition;
    readonly to: TilePosition;
}