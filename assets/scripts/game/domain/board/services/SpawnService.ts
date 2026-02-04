import { BoardRuntimeModel, TileLock } from "../../../application/board/runtime/BoardRuntimeModel";
import { TileSpawned } from "../events/mutations/TileSpawned";
import { BoardLogicalModel } from "../models/BoardLogicalModel";
import { TileFactory } from "../models/TileFactory";
import { TileRepository } from "../models/TileRepository";
import { TileType } from "../models/TileType";
import { BoardService } from "./BoardService";

export class SpawnService extends BoardService {
    protected readonly factory: TileFactory;
    protected readonly types: TileType[];

    public constructor(logicalModel: BoardLogicalModel, runtimeModel: BoardRuntimeModel, repository: TileRepository, factory: TileFactory, types: TileType[]) {
        super(logicalModel, runtimeModel, repository);
        this.factory = factory;
        this.types = types;
    }

    public spawn(): TileSpawned[] {
        const result = [];
        for (let x = 0; x < this.logicalModel.width; x++) {
            for (let y = 0; y < this.logicalModel.height; y++) {
                const position = { x, y };
                const id = this.logicalModel.get(position);
                if (id) continue;
                const type = this.randomType();
                const tile = this.factory.create(type);
                this.logicalModel.register(position, tile.id);
                this.runtimeModel.lockTile(tile.id, TileLock.SPAWN);
                this.tileRepository.register(tile.id, type);

                const spawned: TileSpawned = {
                    kind: "tile.spawned",
                    id: tile.id,
                    at: position,
                    type: type
                };

                result.push(spawned);
            }
        }

        return result;
    }

    private randomType(): TileType {
        return this.types[Math.floor(Math.random() * this.types.length)];
    }
}