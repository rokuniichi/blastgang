import { TileMutation } from "./TileMutation";

export type DestroyCause =
    "match" | "bomb" | "rocket";

export interface TileDestroyed extends TileMutation {
    readonly kind: "tile.destroy";
    readonly at: { x: number; y: number };
    readonly cause: DestroyCause;
}