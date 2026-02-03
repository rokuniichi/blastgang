import { TileType } from "../../models/TileType";
import { TileMutation } from "./TileMutation";

export interface TileTransformed extends TileMutation {
    readonly kind: "tile.transformed";
    readonly before: TileType;
    readonly after: TileType;
}