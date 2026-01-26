import { BoardModel } from "../../domain/models/BoardModel";
import { BoardFillService } from "../../domain/services/BoardFillService";

export class BoardController {

    private readonly _board: BoardModel;
    private readonly _boardFillService: BoardFillService;

    public constructor(board: BoardModel, boardFillService: BoardFillService) {
        this._board = board;
        this._boardFillService = boardFillService;

        this._boardFillService.fillRandom(this._board);
    }
}