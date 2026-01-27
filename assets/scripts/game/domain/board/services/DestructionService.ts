import { BoardModel } from "../models/BoardModel";
import { TilePosition } from "../models/TilePosition";

export class DestructionService {

    public destroy(board: BoardModel, cluster: TilePosition[]): TilePosition[] {
        const result: TilePosition[] = [];

        for (const position of cluster) {
            board.clear(position);
            result.push(position);
        }

        return result;
    }
}