import { TilePosition } from "./TilePosition";
import { TileType } from "./TileType";

export interface TileSpawn {
    readonly at: TilePosition;
    readonly type: TileType;
}