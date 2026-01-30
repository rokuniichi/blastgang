import { BoardRuntime } from "../../../application/board/runtime/BoardRuntime";
import { LogicalBoardModel } from "../models/LogicalBoardModel";

export abstract class BoardService {
    protected readonly logicalModel: LogicalBoardModel;
    protected readonly boardRuntime: BoardRuntime;

    constructor(boardModel: LogicalBoardModel, boardRuntime: BoardRuntime) {
        this.logicalModel = boardModel;
        this.boardRuntime = boardRuntime;
    }
}