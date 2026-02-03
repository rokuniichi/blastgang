import { IConfigValidator } from "../../../../../core/config/IConfigValidator";
import { assertObject, assertNonEmptyArray, assertEnumValue } from "../../../../../core/utils/assert";
import { ensureNumber } from "../../../../../core/utils/ensure";
import { TileType } from "../../../../domain/board/models/TileType";
import { GameConfig } from "./GameConfig";


export class GameConfigValidator implements IConfigValidator<GameConfig> {
    validate(raw: any): GameConfig {
        assertObject(raw, this, "raw");

        const boardCols = ensureNumber(raw.boardCols, this, "boardCols");
        const boardRows = ensureNumber(raw.boardRows, this, "boardRows");
        const clusterSize = ensureNumber(raw.clusterSize, this, "clusterSize");
        const targetScore = ensureNumber(raw.targetScore, this, "targetScore");
        const maxMoves = ensureNumber(raw.maxMoves, this, "maxMoves");
        const scoreMultiplier = ensureNumber(raw.scoreMultiplier, this, "scoreMultiplier");

        assertNonEmptyArray<string>(raw.allowedTypes, this, "allowedTypes");
        const allowedTypes = raw.allowedTypes.map((v, i) =>
            assertEnumValue(TileType, v, this, `allowedTypes[${i}]`)
        );

        return {
            boardCols,
            boardRows,
            allowedTypes,
            clusterSize,
            targetScore,
            maxMoves,
            scoreMultiplier
        };
    }
}
