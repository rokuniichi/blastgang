import { TilePosition } from "../models/TilePosition";
import { BoardService } from "./IBoardService";

export class DestroyService extends BoardService {
    public clear(cluster: TilePosition[]): TilePosition[] {
        const result: TilePosition[] = [];

        for (const position of cluster) {
            this.boardModel.destroy(position);
            result.push(position);
        }

        return result;
    }
}