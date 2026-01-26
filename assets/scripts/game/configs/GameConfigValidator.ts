import { GameConfig } from "./GameConfig";
import { TileType } from "../models/TileType";
import { assertEnumValue, assertString, assertNonEmptyArray, assertObject, assertArray } from "../../core/utils/assert";
import { ensureNumber } from "../../core/utils/ensure";

export class GameConfigValidator {
    static validate(raw: any): GameConfig {
        assertObject(raw, this, "raw");
        const boardWidth = ensureNumber(raw.boardWidth, this, "boardWidth");
        const boardHeight = ensureNumber(raw.boardHeight, this, "boardHeight");
        const minClusterSize = ensureNumber(raw.minClusterSize, this, "minClusterSize");
        const targetScore = ensureNumber(raw.targetScore, this, "targetScore");
        const maxMoves = ensureNumber(raw.maxMoves, this, "maxMoves");

        assertNonEmptyArray<string>(raw.allowedTileTypes, this, "allowedTileTypes");
        const allowedTileTypes = raw.allowedTileTypes.map((v, i) => assertEnumValue(TileType, v, this, `${"allowedTileTypes"}[${i}]`));

        return {
            boardWidth,
            boardHeight,
            allowedTileTypes,
            minClusterSize,
            targetScore,
            maxMoves
        };
    }
}