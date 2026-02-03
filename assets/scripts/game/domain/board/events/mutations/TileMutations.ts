import { TilePosition } from "../../models/TilePosition";
import { TileType } from "../../models/TileType";
import { TileDestroyed } from "./TileDestroyed";
import { TileMoved } from "./TileMoved";
import { TileRejected, TileRejectedReason } from "./TileRejected";
import { TileSpawned } from "./TileSpawned";
import { TileTransformed } from "./TileTransformed";

export class TileMutations {

    static rejected(id: string, reason: TileRejectedReason): TileRejected {
        return {
            kind: "tile.rejected",
            id,
            reason
        };
    }

    static destroyed(
        id: string,
        at: TilePosition,
        cause: "match" | "bomb" | "rocket"
    ): TileDestroyed {
        return {
            kind: "tile.destroy",
            id,
            at,
            cause
        };
    }

    static moved(
        id: string,
        from: TilePosition,
        to: TilePosition
    ): TileMoved {
        return {
            kind: "tile.moved",
            id,
            from,
            to
        };
    }

    static spawned(
        id: string,
        type: TileType,
        at: TilePosition
    ): TileSpawned {
        return {
            kind: "tile.spawned",
            id,
            type,
            at
        };
    }

    static transformed(
        id: string,
        before: TileType,
        after: TileType
    ): TileTransformed {
        return {
            kind: "tile.transformed",
            id,
            before,
            after
        };
    }
}