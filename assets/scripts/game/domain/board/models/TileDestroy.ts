import { TileMutation } from "./TileMutation";
import { TilePosition } from "./TilePosition";

export interface TileDestroy extends TileMutation {
    readonly at: TilePosition;
}