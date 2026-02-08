import { BoardLogicModel } from "../models/BoardLogicModel";
import { TilePositionRepo } from "../models/TilePositionRepo";
import { TileTypeRepo } from "../models/TileTypeRepo";

export abstract class BoardService {
    public constructor(
        protected readonly logicModel: BoardLogicModel,
        protected readonly typeRepo: TileTypeRepo,
        protected readonly positionRepo: TilePositionRepo
    ) { }
}