import { DestroyMutation } from "../../../domain/board/events/mutations/DestroyMutation";
import { MoveMutation } from "../../../domain/board/events/mutations/MoveMutation";
import { ShakeMutation } from "../../../domain/board/events/mutations/ShakeMutation";
import { SpawnMutation } from "../../../domain/board/events/mutations/SpawnMutation";
import { TransformMutation } from "../../../domain/board/events/mutations/TransformationMutation";

export interface VisualPhases {
    readonly shakes: ShakeMutation[];
    readonly transforms: TransformMutation[];
    readonly destroys: DestroyMutation[];
    readonly moves: MoveMutation[];
    readonly spawns: SpawnMutation[];
}