import { TileId } from "../../models/BoardLogicModel";
import { TilePosition } from "../../models/TilePosition";
import { TileType } from "../../models/TileType";
import { DestroyCause, DestroyMutation } from "./DestroyMutation";
import { MoveCause, MoveMutation } from "./MoveMutation";
import { ShakeMutation } from "./ShakeMutation";
import { SpawnMutation } from "./SpawnMutation";
import { TransformMutation } from "./TransformationMutation";

export class TileMutationHelper {

    static shaked(id: string): ShakeMutation {
        return {
            kind: "tile.shaked",
            id
        };
    }

    static destroyed(
        id: TileId,
        destroyed: TileId[],
        cause: DestroyCause
    ): DestroyMutation {
        return {
            kind: "tile.destroy",
            id,
            destroyed,
            cause
        };
    }

    static moved(
        id: string,
        from: TilePosition,
        to: TilePosition,
        cause: MoveCause
    ): MoveMutation {
        return {
            kind: "tile.moved",
            id,
            from,
            to,
            cause
        };
    }

    static spawned(
        id: string,
        at: TilePosition,
        type: TileType
    ): SpawnMutation {
        return {
            kind: "tile.spawned",
            id,
            at,
            type
        };
    }

    static transformed(
        id: string,
        center: TilePosition,
        transformed: TileId[],
        type: TileType
    ): TransformMutation {
        return {
            kind: "tile.transformed",
            id,
            center,
            transformed,
            type
        };
    }
}