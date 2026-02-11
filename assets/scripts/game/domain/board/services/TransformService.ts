import { TileMutationHelper } from "../events/mutations/TileMutationHelper";
import { TransformMutation } from "../events/mutations/TransformationMutation";
import { TileId } from "../models/BoardLogicModel";
import { TileType } from "../models/TileType";
import { BoardService } from "./BoardService";

export class TransformService extends BoardService {
    public tryTransform(centerId: TileId, cluster: TileId[], type: TileType): TransformMutation | null {
        const center = this.positionRepo.get(centerId);
        if (!center) return null;
        const centerType = this.typeRepo.get(centerId);
        if (type === centerType) return null;
        this.typeRepo.register(centerId, type);
        const filtered = cluster.filter(id => id !== centerId);
        return TileMutationHelper.transformed(centerId, center, filtered, type);
    }
}