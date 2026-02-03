import { BoardRuntimeModel } from "../../../application/board/runtime/BoardRuntimeModel";
import { BoardLogicalModel } from "../models/BoardLogicalModel";
import { TileRepository } from "../models/TileRepository";

export abstract class BoardService {
    public constructor(
        protected readonly logicalModel: BoardLogicalModel, 
        protected readonly runtimeModel: BoardRuntimeModel,
        protected readonly tileRepository: TileRepository
    ) { }
}