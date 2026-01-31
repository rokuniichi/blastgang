import { TileLockReason } from "../../../application/board/runtime/RuntimeBoardModel";
import { TileSpawn } from "../models/TileSpawn";
import { TileType } from "../models/TileType";
import { BoardService } from "./BoardService";

export class SpawnService extends BoardService {
    public spawn(allowedTypes: TileType[]): TileSpawn[] {
        const result = [];
        for (let x = 0; x < this.logicalModel.width; x++) {
            for (let y = 0; y < this.logicalModel.height; y++) {
                const position = { x, y };
                if (this.logicalModel.empty(position)) {
                    const type = this.randomTile(allowedTypes);
                    const data = { at: position, type: type };
                    this.logicalModel.spawn(data);
                    result.push(data);
                    this.runtimeModel.lock(TileLockReason.SPAWN, data.at);
                }
            }
        }

        return result;
    }

    private randomTile(allowedTypes: TileType[]): TileType {
        return allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    }
}