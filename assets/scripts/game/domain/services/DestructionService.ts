import { BoardModel } from "../models/BoardModel";
import { Cluster } from "../models/Cluster";
import { TileType } from "../models/TileType";

export class DestructionService {

    public constructor() {}

    public destroy(board: BoardModel, cluster: Cluster): void {
        for (const pos of cluster.tiles) {
            board.set(pos, TileType.NONE);
        }
    }
}