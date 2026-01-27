import { EventBus } from "../../../core/event-system/EventBus";
import { SubscriptionGroup } from "../../../core/event-system/SubscriptionGroup";
import { GameConfig } from "../../config/GameConfig";
import { GravityAppliedEvent } from "../../domain/events/GravityAppliedEvent";
import { TilesDestroyedEvent } from "../../domain/events/TilesDestroyedEvent";
import { BoardModel } from "../../domain/models/BoardModel";
import { DestructionService } from "../../domain/services/DestructionService";
import { FillService } from "../../domain/services/FillService";
import { GravityService } from "../../domain/services/GravityService";
import { SearchService } from "../../domain/services/SearchService";
import { TileClickedEvent } from "../../presentation/events/TileClickedEvent";
import { TilesFinishedDestroying } from "../../presentation/events/TilesFinishedDestroying";
import { GameContext } from "../context/GameContext";
import { BaseController } from "./BaseController";

export class BoardController extends BaseController {
    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    private readonly _board: BoardModel;
    private readonly _fillService: FillService;
    private readonly _searchService: SearchService;
    private readonly _destructionService: DestructionService;
    private readonly _gravityService: GravityService;
    private readonly _eventBus: EventBus;
    private readonly _config: GameConfig;

    public constructor(context: GameContext) {
        super();
        this._board = context.board;
        this._fillService = context.fillService;
        this._searchService = context.searchService;
        this._destructionService = context.destructionService;
        this._gravityService = context.gravityService;
        this._eventBus = context.eventBus;
        this._config = context.gameConfig;
    }

    protected onInit(): void {
        this._fillService.fillRandom(this._board);

        this._subscriptions.add(
            this._eventBus.on(TileClickedEvent, this.onTileClicked)
        );

        this._subscriptions.add(
            this._eventBus.on(TilesFinishedDestroying, this.onTilesFinishedDestroying)
        );
    }

    private onTileClicked = (event: TileClickedEvent): void => {
        const cluster = this._searchService.findCluster(this._board, event.position);

        if (cluster === null || cluster.size < this._config.minClusterSize) return
        this._destructionService.destroy(this._board, cluster);

        this._eventBus.emit(new TilesDestroyedEvent(cluster.tiles));
    };

    private onTilesFinishedDestroying = (event: TilesFinishedDestroying): void => {
        const drops = this._searchService.findDrops(this._board);
        
        this._gravityService.apply(this._board, drops);

        this._eventBus.emit(new GravityAppliedEvent);
    }

    public dispose(): void {
        this._subscriptions.clear();
    }
}