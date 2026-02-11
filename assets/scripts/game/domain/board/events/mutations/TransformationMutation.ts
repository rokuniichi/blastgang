import { TileId } from "../../models/BoardLogicModel";
import { TilePosition } from "../../models/TilePosition";
import { TileType } from "../../models/TileType";
import { ITileMutation } from "./ITileMutation";

export interface TransformMutation extends ITileMutation {
    readonly kind: "tile.transformed";
    readonly center: TilePosition;
    readonly transformed: TileId[];
    readonly type: TileType;
}