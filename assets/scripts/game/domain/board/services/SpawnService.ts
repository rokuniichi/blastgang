import { TileSpawned } from "../events/mutations/TileSpawned";
import { BoardLogicModel } from "../models/BoardLogicModel";
import { TileFactory } from "../models/TileFactory";
import { TileRepository } from "../models/TileRepository";
import { TileType } from "../models/TileType";
import { BoardService } from "./BoardService";

export class SpawnService extends BoardService {
    protected readonly factory: TileFactory;
    protected readonly types: TileType[];

    public constructor(
        logicModel: BoardLogicModel,
        repository: TileRepository,
        factory: TileFactory,
        types: TileType[]
    ) {
        super(logicModel, repository);
        this.factory = factory;
        this.types = types;
    }

    public spawn(): TileSpawned[] {
        const result = [];
        for (let x = 0; x < this.logicModel.width; x++) {
            for (let y = 0; y < this.logicModel.height; y++) {
                const position = { x, y };
                const id = this.logicModel.get(position);
                if (id) continue;
                const type = this.randomType();
                const tile = this.factory.create(type);
                this.logicModel.register(position, tile.id);
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