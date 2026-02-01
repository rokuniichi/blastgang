import { BoardRuntimeModel } from "../../../application/board/runtime/BoardRuntimeModel";
import { BoardLogicalModel } from "../models/BoardLogicalModel";

export abstract class BoardService {
    public constructor(
        protected readonly logicalModel: BoardLogicalModel, 
        protected readonly runtimeModel: BoardRuntimeModel
    ) { }
}