import { EventBus } from "../../../../../core/eventbus/EventBus";
import { BoardInfo } from "../../../../config/game/GameConfig";
import { BoardMutationsBatch } from "../../../../domain/board/events/BoardMutationsBatch";
import { MoveMutation } from "../../../../domain/board/events/mutations/MoveMutation";
import { TransformMutation } from "../../../../domain/board/events/mutations/TransformationMutation";
import { TileId } from "../../../../domain/board/models/BoardLogicModel";
import { TileType } from "../../../../domain/board/models/TileType";
import { TileTypeRepo } from "../../../../domain/board/models/TileTypeRepo";
import { DestroyService } from "../../../../domain/board/services/DestroyService";
import { MoveService } from "../../../../domain/board/services/MoveService";
import { SearchService } from "../../../../domain/board/services/SearchService";
import { SpawnService } from "../../../../domain/board/services/SpawnService";
import { TransformService } from "../../../../domain/board/services/TransformService";
import { DomainGraph } from "../../../../domain/DomainGraph";
import { BoosterType } from "../../../../domain/state/models/BoosterType";
import { GameStateModel } from "../../../../domain/state/models/GameStateModel";
import { EventController } from "../../../common/controllers/BaseController";
import { BombEmplaceIntent } from "../../../input/intents/BombEmplaceIntent";
import { NormalIntent } from "../../../input/intents/NormalIntent";
import { SwapIntent } from "../../../input/intents/SwapIntent";
import { BoosterIntentComplete } from "../../../state/events/BoosterIntentComplete";
import { NormalIntentComplete } from "../../../state/events/NormalIntentComplete";
import { BoardInteractivityModel } from "../../runtime/models/BoardInteractivityModel";
import { BoardStrategyFactory } from "../strategies/BoardStrategyFactory";

export class BoardLogicController extends EventController {

    private readonly _boardInfo: BoardInfo;
    private readonly _interactivityModel: BoardInteractivityModel;
    private readonly _stateModel: GameStateModel;
    private readonly _typeRepo: TileTypeRepo;
    private readonly _spawnService: SpawnService;
    private readonly _searchService: SearchService;
    private readonly _destroyService: DestroyService;
    private readonly _moveService: MoveService;
    private readonly _transformService: TransformService;

    private readonly _strategyFactory: BoardStrategyFactory;

    public constructor(eventBus: EventBus, domain: DomainGraph, interactivityModel: BoardInteractivityModel) {
        super(eventBus);

        this._boardInfo = domain.boardInfo;
        this._interactivityModel = interactivityModel;
        this._stateModel = domain.stateModel;
        this._typeRepo = domain.typeRepo;
        this._spawnService = domain.spawnService;
        this._searchService = domain.searchService;
        this._destroyService = domain.destroyService;
        this._moveService = domain.moveService;
        this._transformService = domain.transformService;

        this._strategyFactory = new BoardStrategyFactory(
            this._boardInfo,
            this._interactivityModel,
            this._typeRepo,
            this._searchService,
            this._destroyService,
            this._transformService,
            this._moveService,
            this._spawnService
        );
    }

    protected onInit(): void {
        const spawned = this._spawnService.spawn();
        const initialBatch = new BoardMutationsBatch();
        spawned.forEach((spawn) => {
            initialBatch.push(spawn);
            this._interactivityModel.addBlocker(spawn.id)
        });
        this.emit(initialBatch);
        this.on(NormalIntent, this.onNormalIntent);
        this.on(SwapIntent, this.onSwapIntent);
        this.on(BombEmplaceIntent, this.onBombEmplaceIntent);
    }

    private onNormalIntent = (event: NormalIntent): void => {
        const strategy = this._strategyFactory.getStrategy(event.id);
        const batch = strategy.execute(event.id);
        this.sync(batch);
        this.emit(batch);
    };

    private onSwapIntent = (event: SwapIntent): void => {
        const batch = new BoardMutationsBatch();
        const swaps = this.swap(event.first, event.second);
        swaps.forEach((swap) => batch.push(swap));
        this.emit(new BoosterIntentComplete(BoosterType.SWAP));
        this.emit(batch);
    };

    private onBombEmplaceIntent = (event: BombEmplaceIntent): void => {
        const batch = new BoardMutationsBatch();
        const transform = this.emplace(event.id, TileType.BOMB);
        if (transform === null) return;
        batch.push(transform);
        this.emit(new BoosterIntentComplete(BoosterType.BOMB));
        this.emit(batch);
    }

    private swap(first: TileId, second: TileId): MoveMutation[] {
        this._interactivityModel.addUnstable(first);
        this._interactivityModel.addUnstable(second);
        return this._moveService.swap(first, second);
    }

    private emplace(id: TileId, type: TileType): TransformMutation | null {
        const transform = this._transformService.tryTransform(id, [], type);
        if (transform === null) return null;
        this._interactivityModel.addUnstable(id);
        return transform;
    }

    private sync(batch: BoardMutationsBatch) {
        let clusterDestroys = 0;
        let collateralDestroys = 0;
        batch.mutations.forEach((mutation) => {
            switch (mutation.kind) {
                case "tile.transformed":
                    if (mutation.transformed.length > 0)
                        clusterDestroys += mutation.transformed.length + 1;
                    break;
                case "tile.destroy":
                    if (mutation.cause === "match")
                        clusterDestroys += mutation.destroyed.length;
                    else
                        collateralDestroys += mutation.destroyed.length;
                default:
                    break;
            }
        });

        if (clusterDestroys > 0 || collateralDestroys > 0)
            this.emit(new NormalIntentComplete(clusterDestroys, collateralDestroys));
    }
}