import { TilePosition } from "../../models/TilePosition";
import { TileType } from "../../models/TileType";
import { DestroyCause, TileDestroyed } from "./TileDestroyed";
import { MoveCause, TileMoved } from "./TileMoved";
import { TileShaked } from "./TileRejected";
import { TileSpawned } from "./TileSpawned";
import { TileTransformed } from "./TileTransformed";

export class TileMutationHelper {

    static shaked(id: string): TileShaked {
        return {
            kind: "tile.shaked",
            id
        };
    }

    static destroyed(
        id: string,
        at: TilePosition,
        cause: DestroyCause
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
        to: TilePosition,
        cause: MoveCause
    ): TileMoved {
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
    ): TileSpawned {
        return {
            kind: "tile.spawned",
            id,
            at,
            type
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