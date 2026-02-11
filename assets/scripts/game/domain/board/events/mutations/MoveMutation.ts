import { TilePosition } from "../../models/TilePosition";
import { ITileMutation } from "./ITileMutation";

export type MoveCause =
    "drop" | "swap";

export interface MoveMutation extends ITileMutation {
    readonly kind: "tile.moved";
    readonly from: TilePosition;
    readonly to: TilePosition;
    readonly cause: MoveCause;
}