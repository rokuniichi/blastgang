import { TilePosition } from "./TilePosition";
import { TileType } from "./TileType";

export type TileCommit = {
    position: TilePosition;
    before: TileType;
    after: TileType;
}