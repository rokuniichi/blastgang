import { TileId } from "../../models/BoardLogicModel";
import { ITileMutation } from "./ITileMutation";

export type DestroyCause =
    "match" | "bomb" | "horizontal_rocket" | "vertical_rocket" | "superbomb"

export interface DestroyMutation extends ITileMutation {
    readonly kind: "tile.destroy";
    readonly destroyed: TileId[];
    readonly cause: DestroyCause;
}