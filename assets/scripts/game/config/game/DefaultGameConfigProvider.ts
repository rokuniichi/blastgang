import { BaseConfigProvider } from "../../../core/config/providers/BaseConfigProvider";
import { TileType } from "../../domain/board/models/TileType";
import { BoosterType } from "../../domain/state/models/BoosterType";
import { GameConfig, ThresholdInfo } from "./GameConfig";
import { ThresholdType } from "./ThresholdType";


export class DefaultGameConfigProvider extends BaseConfigProvider<GameConfig> {
    async load(): Promise<void> {
        const specials: ThresholdInfo[] = [
            { type: ThresholdType.ROCKET, amount: 4 },
            { type: ThresholdType.BOMB, amount: 6 },
            { type: ThresholdType.SUPER_BOMB, amount: 10 }
        ];

        specials.sort((a, b) => b.amount - a.amount);

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
                bombRadius: 1,
                specials
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