import { BoardModel } from "../models/BoardModel";
import { TileType } from "../models/TileType";
import { BoardFillService } from "../services/BoardFillService";

export class BoardController {

    private readonly _board: BoardModel;
    private readonly _boardFillService: BoardFillService;

    public constructor(board: BoardModel, boardFillService: BoardFillService) {
        this._board = board;
        this._boardFillService = boardFillService;

        this._boardFillService.fillWithType(this._board, TileType.GREEN);
    }
}