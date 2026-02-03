import { TileMutation } from "./TileMutation";

export interface TileDestroyed extends TileMutation {
    readonly kind: "tile.destroy";
    readonly at: { x: number; y: number };
    readonly cause: "match" | "bomb" | "rocket";
}