import { TileMutation } from "./TileMutation";
import { TilePosition } from "./TilePosition";
import { TileType } from "./TileType";

export interface TileMove extends TileMutation {
    readonly from: TilePosition;
    readonly to: TilePosition;
}