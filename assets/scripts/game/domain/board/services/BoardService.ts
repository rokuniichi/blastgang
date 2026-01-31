import { RuntimeBoardModel } from "../../../application/board/runtime/RuntimeBoardModel";
import { LogicalBoardModel } from "../models/LogicalBoardModel";

export abstract class BoardService {
    public constructor(
        protected readonly logicalModel: LogicalBoardModel, 
        protected readonly runtimeModel: RuntimeBoardModel
    ) { }
}