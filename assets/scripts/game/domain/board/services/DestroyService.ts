import { DestroyCause, DestroyMutation } from "../events/mutations/DestroyMutation";
import { TileMutationHelper } from "../events/mutations/TileMutationHelper";
import { TileId } from "../models/BoardLogicModel";
import { BoardService } from "./BoardService";

export class DestroyService extends BoardService {
    public destroyNormalCluster(cluster: TileId[], centerId: TileId, cause: DestroyCause): DestroyMutation | null {
        const destroyed = [];

        for (const id of cluster) {
            if (this.tryDestroyTile(id)) {
                destroyed.push(id);
            }
        }

        return TileMutationHelper.destroyed(centerId, destroyed, cause);
    }

    public destroyAll(centerId: TileId, cause: DestroyCause): DestroyMutation {
        const destroyed = [];

        for (let x = 0; x < this.logicModel.width; x++) {
            for (let y = 0; y < this.logicModel.height; y++) {
                const target = this.logicModel.get(x, y);
                if (target === null) continue;
                if (this.tryDestroyTile(target))
                    destroyed.push(target);
            }
        }

        return TileMutationHelper.destroyed(centerId, destroyed, cause);
    }

    public destroyInRow(centerId: TileId, cause: DestroyCause): DestroyMutation | null {
        const center = this.positionRepo.get(centerId);
        if (!center) return null;

        const destroyed = [];

        for (let x = 0; x < this.logicModel.width; x++) {
            const tile = this.logicModel.get(x, center.y);
            if (tile === null) continue;
            if (this.tryDestroyTile(tile))
                destroyed.push(tile);
        }

        if (destroyed.length === 0) return null;

        return TileMutationHelper.destroyed(
            centerId,
            destroyed,
            cause
        );
    }

    public destroyInCol(centerId: TileId, cause: DestroyCause): DestroyMutation | null {
        const center = this.positionRepo.get(centerId);
        if (!center) return null;

        const destroyed = [];

        for (let y = 0; y < this.logicModel.height; y++) {
            const tile = this.logicModel.get(center.x, y);
            if (tile === null) continue;
            if (this.tryDestroyTile(tile))
                destroyed.push(tile);
        }

        if (destroyed.length === 0) return null;

        return TileMutationHelper.destroyed(
            centerId,
            destroyed,
            cause
        );
    }

    public destroyInRadius(centerId: TileId, radius: number, cause: DestroyCause): DestroyMutation | null {

        const center = this.positionRepo.get(centerId);
        if (!center) return null;

        const destroyed = [];

        const minX = Math.max(0, center.x - radius);
        const maxX = Math.min(this.logicModel.width - 1, center.x + radius);

        const minY = Math.max(0, center.y - radius);
        const maxY = Math.min(this.logicModel.height - 1, center.y + radius);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                const targetId = this.logicModel.get(x, y);
                if (!targetId) continue;

                if (this.tryDestroyTile(targetId))
                    destroyed.push(targetId);
            }
        }

        if (destroyed.length === 0) return null;

        return TileMutationHelper.destroyed(
            centerId,
            destroyed,
            cause
        );
    }

    public tryDestroyTile(id: TileId): boolean {
        const at = this.positionRepo.get(id);
        if (!at) return false;
        this.logicModel.destroy(at);
        this.typeRepo.remove(id);
        this.positionRepo.remove(id);
        return true;
    }
}