import { BoardModel } from "../models/BoardModel";
import { TileChangeReason } from "../models/TileChangeReason";
import { TilePosition } from "../models/TilePosition";

export class ClearService {

    public clear(reason: TileChangeReason, board: BoardModel, cluster: TilePosition[]): TilePosition[] {
        const result: TilePosition[] = [];

        for (const position of cluster) {
            board.clear(reason, position);
            result.push(position);
        }

        return result;
    }
}