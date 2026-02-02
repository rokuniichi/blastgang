import { TilePosition } from "./TilePosition";
import { TileType } from "./TileType";

export interface TileSpawn {
    readonly type: TileType;
    readonly at: TilePosition;
}