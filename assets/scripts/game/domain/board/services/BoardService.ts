import { BoardModel } from "../models/BoardModel";

export abstract class BoardService {
    protected readonly boardModel: BoardModel;

    constructor(boardModel: BoardModel) {
        this.boardModel = boardModel;
    }
}