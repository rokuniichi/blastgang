import { ITileMutation } from "./ITileMutation";

export interface ShakeMutation extends ITileMutation {
    readonly kind: "tile.shaked";
}