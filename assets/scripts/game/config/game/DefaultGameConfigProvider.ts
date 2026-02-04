import { BaseConfigProvider } from "../../../core/config/providers/BaseConfigProvider";
import { TileType } from "../../domain/board/models/TileType";
import { BoosterType } from "../../domain/state/models/BoosterType";
import { GameConfig } from "./GameConfig";


export class DefaultGameConfigProvider extends BaseConfigProvider<GameConfig> {
    async load(): Promise<void> {
        const boosters = new Map<BoosterType, number>([
            [BoosterType.SWAP, 3],
            [BoosterType.BOMB, 3]
        ])

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
                boosters
            }
        };
    }
}