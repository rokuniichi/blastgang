import { BaseConfigProvider } from "../../../../../core/config/BaseConfigProvider";
import { TileType } from "../../../../domain/board/models/TileType";
import { GameConfig } from "./GameConfig";

export class DefaultGameConfigProvider extends BaseConfigProvider<GameConfig> {
    async load(): Promise<void> {
        this.config = {
            boardWidth: 9,
            boardHeight: 9,
            allowedTypes: [
                TileType.RED,
                TileType.GREEN,
                TileType.BLUE,
                TileType.PURPLE,
                TileType.YELLOW
            ],
            clusterSize: 3,
            targetScore: 500,
            maxMoves: 20,
            scoreMultiplier: 5
        };
    }
}