import { IEvent } from "../../../../core/eventbus/IEvent";
import { DestroyMutation } from "./mutations/DestroyMutation";
import { MoveMutation } from "./mutations/MoveMutation";
import { ShakeMutation } from "./mutations/ShakeMutation";
import { SpawnMutation } from "./mutations/SpawnMutation";
import { TransformMutation } from "./mutations/TransformationMutation";

type BoardMutation =
    | DestroyMutation
    | MoveMutation
    | ShakeMutation
    | TransformMutation
    | SpawnMutation

export class BoardMutationsBatch implements IEvent {
    public readonly mutations: BoardMutation[];

    public constructor() {
        this.mutations = [];
    }

    public push(mutation: BoardMutation): void {
        this.mutations.push(mutation);
    }
}