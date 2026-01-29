import { BoardModel } from "../models/BoardModel";
import { TileChangeReason } from "../models/TileChangeReason";
import { TileMove } from "../models/TileMove";

export class MoveService {

    public move(reason: TileChangeReason, board: BoardModel, drops: readonly TileMove[]): void {
        for (const drop of drops) {
            board.move(reason, drop.from, drop.to)
        }
    }
}