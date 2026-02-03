import { TilePosition } from "../../models/TilePosition";
import { TileType } from "../../models/TileType";
import { TileMutation } from "./TileMutation";

export interface TileSpawned extends TileMutation {
    readonly kind: "tile.spawned";
    readonly at: TilePosition;
    readonly type: TileType;
}