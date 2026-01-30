import { BoardRuntime } from "../../../application/board/runtime/BoardRuntime";
import { BoardModel } from "../models/BoardModel";

export abstract class BoardService {
    protected readonly boardModel: BoardModel;
    protected readonly boardRuntime: BoardRuntime;

    constructor(boardModel: BoardModel, boardRuntime: BoardRuntime) {
        this.boardModel = boardModel;
        this.boardRuntime = boardRuntime;
    }
}