import { IEvent } from "../../../../core/events/IEvent";
import { TileDestroyed } from "./mutations/TileDestroyed";
import { TileMoved } from "./mutations/TileMoved";
import { TileRejected } from "./mutations/TileRejected";
import { TileSpawned } from "./mutations/TileSpawned";
import { TileTransformed } from "./mutations/TileTransformed";

type BoardMutation =
    | TileDestroyed
    | TileMoved
    | TileSpawned
    | TileTransformed
    | TileRejected;

export class BoardMutationsBatch implements IEvent {
    public constructor(public readonly mutations: BoardMutation[]) { }
}