import { TileMutation } from "./TileMutation";

export const TileRejectedReason = {
    NO_MATCH: "no_match",
    UNSTABLE: "unstable",
    NON_EXISTANT: "non_existant"
} as const;

export type TileRejectedReason =
    typeof TileRejectedReason[keyof typeof TileRejectedReason];

export interface TileRejected extends TileMutation {
    readonly kind: "tile.rejected";
    readonly reason: TileRejectedReason;
}