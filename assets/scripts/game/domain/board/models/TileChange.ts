import { TilePosition } from "./TilePosition";
import { TileType } from "./TileType";

export type TileChange = {
    position: TilePosition;
    before: TileType;
    after: TileType;
}