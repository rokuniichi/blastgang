import { TilePosition } from "../../models/TilePosition";
import { TileType } from "../../models/TileType";
import { ITileMutation } from "./ITileMutation";

export interface SpawnMutation extends ITileMutation {
    readonly kind: "tile.spawned";
    readonly at: TilePosition;
    readonly type: TileType;
}