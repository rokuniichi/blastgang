import { BoardLogicModel } from "../models/BoardLogicModel";
import { TileRepository } from "../models/TileRepository";

export abstract class BoardService {
    public constructor(
        protected readonly logicModel: BoardLogicModel, 
        protected readonly tileRepository: TileRepository
    ) { }
}