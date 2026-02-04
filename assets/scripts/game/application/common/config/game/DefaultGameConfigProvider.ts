import { BaseConfigProvider } from "../../../../../core/config/BaseConfigProvider";
import { TileType } from "../../../../domain/board/models/TileType";
import { GameConfig } from "./GameConfig";

export class DefaultGameConfigProvider extends BaseConfigProvider<GameConfig> {
    async load(): Promise<void> {
        this.config = {
            board: {
                cols: 8,
                rows: 8,
                allowedTypes: [
                    TileType.RED,
                    TileType.GREEN,
                    TileType.BLUE,
                    TileType.PURPLE,
                    TileType.YELLOW
                ],
                clusterSize: 3,
            },

            gameState: {
                targetScore: 500,
                maxMoves: 20,
                scoreMultiplier: 5,
                boosters: {
                    swap: 3,
                    bomb: 3
                }
            }
        };
    }
}