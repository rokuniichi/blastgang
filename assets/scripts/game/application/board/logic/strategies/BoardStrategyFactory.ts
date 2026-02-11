import { BoardInfo } from "../../../../config/game/GameConfig";
import { TileId } from "../../../../domain/board/models/BoardLogicModel";
import { TileType } from "../../../../domain/board/models/TileType";
import { TileTypeRepo } from "../../../../domain/board/models/TileTypeRepo";
import { DestroyService } from "../../../../domain/board/services/DestroyService";
import { MoveService } from "../../../../domain/board/services/MoveService";
import { SearchService } from "../../../../domain/board/services/SearchService";
import { SpawnService } from "../../../../domain/board/services/SpawnService";
import { TransformService } from "../../../../domain/board/services/TransformService";
import { BoardInteractivityModel } from "../../runtime/models/BoardInteractivityModel";
import { BaseBoardStrategy } from "./BaseBoardStrategy";
import { BombStrategy } from "./BombStrategy";
import { NormalStrategy } from "./NormalStrategy";
import { RocketStrategy } from "./RocketStrategy";
import { SuperBombStrategy } from "./SuperBombStrategy";

export class BoardStrategyFactory {
    public constructor(
        private readonly _boardInfo: BoardInfo,
        private readonly _interactivityModel: BoardInteractivityModel,
        private readonly _typeRepo: TileTypeRepo,
        private readonly _searchService: SearchService,
        private readonly _destroyService: DestroyService,
        private readonly _transformService: TransformService,
        private readonly _moveService: MoveService,
        private readonly _spawnService: SpawnService
    ) { }

    public getStrategy(id: TileId): BaseBoardStrategy {
        const type = this._typeRepo.get(id);

        switch (type) {
            case TileType.RED:
            case TileType.GREEN:
            case TileType.BLUE:
            case TileType.PURPLE:
            case TileType.YELLOW:
                return new NormalStrategy(
                    this._boardInfo,
                    this._interactivityModel,
                    this._searchService,
                    this._destroyService,
                    this._transformService,
                    this._moveService,
                    this._spawnService
                );
            case TileType.BOMB:
                return new BombStrategy(
                    this._boardInfo,
                    this._interactivityModel,
                    this._destroyService,
                    this._moveService,
                    this._spawnService
                );
            case TileType.HORIZONTAL_ROCKET:
            case TileType.VERTICAL_ROCKET:
                return new RocketStrategy(
                    type,
                    this._interactivityModel,
                    this._destroyService,
                    this._moveService,
                    this._spawnService
                );
            case TileType.SUPER_BOMB:
                return new SuperBombStrategy(
                    this._interactivityModel,
                    this._destroyService,
                    this._moveService,
                    this._spawnService
                );
            default:
                throw new Error(`Unknown tile type: ${type}`);
        }
    }

}