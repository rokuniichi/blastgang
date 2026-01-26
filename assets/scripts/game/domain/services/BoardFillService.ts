import { Random } from "../../../core/utils/random";
import { GameConfig } from "../../config/GameConfig";
import { BoardModel } from "../models/BoardModel";
import { TileType } from "../models/TileType";

export class BoardFillService {
    private readonly _allowedTileTypes: TileType[];

    constructor(config: GameConfig) {
        this._allowedTileTypes = config.allowedTileTypes;
    }

    public fillEmpty(board: BoardModel): void {
        this.fillAll(board, TileType.NONE);
    }

    public fillWithType(board: BoardModel, type: TileType): void {
        this.fillAll(board, type);
    }

    public fillRandom(board: BoardModel): void {
        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                board.set(x, y, this.randomTileType());
            }
        }
    }

    private fillAll(board: BoardModel, type: TileType): void {
        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                board.set(x, y, type);
            }
        }
    }

    private randomTileType(): TileType {
        return this._allowedTileTypes[Random.intRange(0, this._allowedTileTypes.length)]
    }
}