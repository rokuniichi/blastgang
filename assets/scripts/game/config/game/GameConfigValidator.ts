import { IConfigValidator } from "../../../core/config/IConfigValidator";
import { ensureEnumValue, ensureNonEmptyArray, ensureNumber, ensureObject } from "../../../core/utils/ensure";
import { TileType } from "../../domain/board/models/TileType";
import { BoosterType } from "../../domain/state/models/BoosterType";
import { GameConfig, BoardInfo, GameStateInfo } from "./GameConfig";

export class GameConfigValidator implements IConfigValidator<GameConfig> {
    validate(raw: any): GameConfig {
        //assertObject(raw, this, "raw");
        const data = ensureObject(raw, this, "raw");

        const boardData = ensureObject(data.board, this, "board");

        const cols = ensureNumber(boardData.cols, this, "board.cols");
        const rows = ensureNumber(boardData.rows, this, "board.rows");
        const clusterSize = ensureNumber(boardData.clusterSize, this, "board.cluster");
        const allowedTypes = ensureNonEmptyArray(boardData.allowedTypes, this, "board.types")
            .map((v, i) => ensureEnumValue(TileType, v, this, `board.allowedTypes${i}`))

        const board: BoardInfo = {
            cols,
            rows,
            clusterSize,
            allowedTypes
        }

        const gameStateData = ensureObject(data.gameState, this, "gameState");

        const targetScore = ensureNumber(gameStateData.targetScore, this, "gameState.targetScore");
        const maxMoves = ensureNumber(gameStateData.maxMoves, this, "gameState.maxMoves");
        const scoreMultiplier = ensureNumber(gameStateData.scoreMultiplier, this, "gameState.scoreMultiplier");

        const boostersData = ensureObject(gameStateData.boosters, this, "gameStateData.boosters")

        const boosters = new Map<BoosterType, number>();

        console.log("boostersData", boostersData);

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
