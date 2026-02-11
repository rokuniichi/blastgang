import { IConfigValidator } from "../../../core/config/IConfigValidator";
import { ensureEnumValue, ensureNonEmptyArray, ensureNumber, ensureObject } from "../../../core/utils/ensure";
import { TileType } from "../../domain/board/models/TileType";
import { BoosterType } from "../../domain/state/models/BoosterType";
import { BoardInfo, GameConfig, GameStateInfo, ThresholdInfo } from "./GameConfig";
import { ThresholdType } from "./ThresholdType";

export class GameConfigValidator implements IConfigValidator<GameConfig> {
    validate(raw: any): GameConfig {
        const data = ensureObject(raw, this, "raw");

        const boardData = ensureObject(data.board, this, "board");

        const cols = ensureNumber(boardData.cols, this, "board.cols");
        const rows = ensureNumber(boardData.rows, this, "board.rows");
        const allowedTypes = ensureNonEmptyArray(boardData.allowedTypes, this, "board.allowedTypes")
            .map((v, i) => ensureEnumValue(TileType, v, this, `board.allowedTypes${i}`));
        const clusterSize = ensureNumber(boardData.clusterSize, this, "board.cluster");
        const bombRadius = ensureNumber(boardData.bombRadius, this, "board.bombRadius");

        const specialsData = ensureObject(boardData.specials, this, "board.specials");

        const specials: ThresholdInfo[] = [];

        for (const [key, value] of Object.entries(specialsData)) {
            const type = ensureEnumValue(ThresholdType, key, this, `board.specials.${key}`);
            const amount = ensureNumber(value, this, `board.specials.${value}`);
            const threshold: ThresholdInfo = { type, amount };
            specials.push(threshold);
        }

        specials.sort((a, b) => b.amount - a.amount);

        const board: BoardInfo = {
            cols,
            rows,
            allowedTypes,
            clusterSize,
            bombRadius,
            specials
        }

        const gameStateData = ensureObject(data.gameState, this, "gameState");

        const targetScore = ensureNumber(gameStateData.targetScore, this, "gameState.targetScore");
        const maxMoves = ensureNumber(gameStateData.maxMoves, this, "gameState.maxMoves");
        const scoreMultiplier = ensureNumber(gameStateData.scoreMultiplier, this, "gameState.scoreMultiplier");

        const boostersData = ensureObject(gameStateData.boosters, this, "gameStateData.boosters")

        const boosters = new Map<BoosterType, number>();

        for (const [key, value] of Object.entries(boostersData)) {
            const boosterType = ensureEnumValue(BoosterType, key, this, `gameState.boosters.${key}`);
            const amount = ensureNumber(value, this, `gameState.boosters.${key}`);
            boosters.set(boosterType, amount);
        }

        const gameState: GameStateInfo = {
            targetScore,
            maxMoves,
            scoreMultiplier,
            boosters
        }

        const config: GameConfig = {
            board,
            gameState
        }

        return config;
    }
}
