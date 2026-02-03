import { TilePosition } from "../../models/TilePosition";
import { TileMutation } from "./TileMutation";

export interface TileMoved extends TileMutation {
    readonly kind: "tile.moved";
    readonly from: TilePosition;
    readonly to: TilePosition;
    readonly cause: "drop" | "swap";
}