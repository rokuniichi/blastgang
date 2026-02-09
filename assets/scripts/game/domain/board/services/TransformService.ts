import { TileMutationHelper } from "../events/mutations/TileMutationHelper";
import { TileTransformed } from "../events/mutations/TileTransformed";
import { TileId } from "../models/BoardLogicModel";
import { TileType } from "../models/TileType";
import { BoardService } from "./BoardService";

export class TransformService extends BoardService {
    public transform(id: TileId, type: TileType): TileTransformed {
        const before = this.typeRepo.get(id) ?? TileType.EMPTY;
        this.typeRepo.register(id, type);
        return TileMutationHelper.transformed(id, before, type);
    }
}