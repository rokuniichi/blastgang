import { BoardModel } from "../models/BoardModel";
import { Cluster } from "../models/Cluster";
import { TileType } from "../models/TileType";

export class DestructionService {

    public constructor() {}

    public destroy(board: BoardModel, cluster: Cluster): void {
        for (const position of cluster.tiles) {
            board.clear(position);
        }
    }
}