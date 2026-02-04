import { IConfigValidator } from "../../../../../core/config/IConfigValidator";
import { assertEnumValue } from "../../../../../core/utils/assert";
import { ensureNonEmptyArray, ensureNumber, ensureObject } from "../../../../../core/utils/ensure";
import { TileType } from "../../../../domain/board/models/TileType";
import { BoardInfo, BoostersInfo, GameConfig, GameStateInfo } from "./GameConfig";


export class GameConfigValidator implements IConfigValidator<GameConfig> {
    validate(raw: any): GameConfig {
        //assertObject(raw, this, "raw");
        const data = ensureObject(raw, this, "raw");

        const boardData = ensureObject(data.board, this, "board");

        const cols = ensureNumber(boardData.cols, this, "board.cols");
        const rows = ensureNumber(boardData.rows, this, "board.rows");
        const clusterSize = ensureNumber(boardData.clusterSize, this, "board.cluster");
        const allowedTypes = ensureNonEmptyArray(boardData.allowedTypes, this, "board.types")
            .map((v, i) =>
                assertEnumValue(TileType, v, this, `allowedTypes[${i}]`)
            );
        
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

        const boostersData = ensureObject(gameStateData.boosters, this, "gameState.boostsers")
        const swap = ensureNumber(boostersData.swap, this, "boosters.swap");
        const bomb = ensureNumber(boostersData.bomb, this, "boosters.bomb");

        const boosters: BoostersInfo = {
            swap,
            bomb
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
