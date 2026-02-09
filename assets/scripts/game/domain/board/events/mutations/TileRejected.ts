import { TileMutation } from "./TileMutation";

export interface TileShaked extends TileMutation {
    readonly kind: "tile.shaked";
}