import { SpawnMutation } from "../events/mutations/SpawnMutation";
import { BoardLogicModel } from "../models/BoardLogicModel";
import { TileFactory } from "../models/TileFactory";
import { TileTypeRepo } from "../models/TileTypeRepo";
import { TileType } from "../models/TileType";
import { BoardService } from "./BoardService";
import { TilePositionRepo } from "../models/TilePositionRepo";
import { TileMutationHelper } from "../events/mutations/TileMutationHelper";

export class SpawnService extends BoardService {
    protected readonly factory: TileFactory;
    protected readonly types: TileType[];

    public constructor(
        logicModel: BoardLogicModel,
        typeRepo: TileTypeRepo,
        positionRepo: TilePositionRepo,
        factory: TileFactory,
        types: TileType[]
    ) {
        super(logicModel, typeRepo, positionRepo);
        this.factory = factory;
        this.types = types;
    }

    public spawn(): SpawnMutation[] {
        const result = [];
        for (let x = 0; x < this.logicModel.width; x++) {
            for (let y = 0; y < this.logicModel.height; y++) {
                let id = this.logicModel.get(x, y);
                if (id) continue;
                const at = { x, y };
                const type = this.randomType();
                id = this.factory.create();
                this.logicModel.register({ x, y }, id);
                this.typeRepo.register(id, type);
                this.positionRepo.move(id, at);
                const spawned = TileMutationHelper.spawned(id, at, type);
                result.push(spawned);
            }
        }

        return result;
    }

    private randomType(): TileType {
        return this.types[Math.floor(Math.random() * this.types.length)];
    }
}