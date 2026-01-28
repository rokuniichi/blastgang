import { assertEnumValue, assertNonEmptyArray, assertObject } from "../../../core/utils/assert";
import { ensureNumber } from "../../../core/utils/ensure";
import { TileType } from "../../domain/board/models/TileType";
import { GameConfig } from "./GameConfig";

export class GameConfigValidator {
    static validate(raw: any): GameConfig {
        assertObject(raw, this, "raw");
        const boardWidth = ensureNumber(raw.boardWidth, this, "boardWidth");
        const boardHeight = ensureNumber(raw.boardHeight, this, "boardHeight");
        const clusterSize = ensureNumber(raw.clusterSize, this, "clusterSize");
        const targetScore = ensureNumber(raw.targetScore, this, "targetScore");
        const maxMoves = ensureNumber(raw.maxMoves, this, "maxMoves");
        const scoreMultiplier = ensureNumber(raw.scoreMultiplier, this, "scoreMultiplier");

        assertNonEmptyArray<string>(raw.allowedTypes, this, "allowedTypes");
        const allowedTypes = raw.allowedTypes.map((v, i) => assertEnumValue(TileType, v, this, `${"allowedTypes"}[${i}]`));

        return {
            boardWidth,
            boardHeight,
            allowedTypes,
            clusterSize,
            targetScore,
            maxMoves,
            scoreMultiplier
        };
    }
}