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
        board.fillWithType(TileType.NONE);
    }

    public fillWithType(board: BoardModel, type: TileType): void {
        board.fillWithType(type);
    }

    public fillRandom(board: BoardModel): void {
        board.fillWithGenerator(() => this.randomTileType());
    }

    private randomTileType(): TileType {
        return this._allowedTileTypes[Random.intRange(0, this._allowedTileTypes.length)];
    }
}