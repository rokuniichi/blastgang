import { BoardModel } from "../models/BoardModel";
import { TileCluster } from "../models/TileCluster";
import { TileType } from "../models/TileType";

export class DestructionService {

    public constructor() {}

    public destroy(board: BoardModel, cluster: TileCluster): void {
        for (const position of cluster.tiles) {
            board.clear(position);
        }
    }
}