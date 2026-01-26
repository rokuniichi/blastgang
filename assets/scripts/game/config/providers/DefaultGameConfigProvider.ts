import { TileType } from "../../domain/models/TileType";
import { BaseGameConfigProvider } from "./BaseGameConfigProvider";

export class DefaultGameConfigProvider extends BaseGameConfigProvider {
    async load(): Promise<void> {
        this.config = {
            boardWidth: 9,
            boardHeight: 9,
            allowedTileTypes: [
                TileType.RED,
                TileType.GREEN,
                TileType.BLUE,
                TileType.PURPLE,
                TileType.YELLOW
            ],
            minClusterSize: 3,
            targetScore: 500,
            maxMoves: 20
        };
    }
}