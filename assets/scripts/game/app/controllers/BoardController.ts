import { BoardModel } from "../../domain/models/BoardModel";
import { BoardFillService } from "../../domain/services/BoardFillService";
import { EventBus } from "../../../core/event-system/EventBus";
import { BaseController } from "./BaseController";
import { TileClickedEvent } from "../../presentation/events/TileClickedEvent";
import { TileClusterSearchService } from "../../domain/services/TileClusterSearchService";

export class BoardController extends BaseController {

    private readonly _board: BoardModel;

    private readonly _boardFillService: BoardFillService;
    private readonly _tileClusterService: TileClusterSearchService;
    
    private readonly _eventBus: EventBus;

    constructor(
        board: BoardModel,
        boardFillService: BoardFillService,
        tileClusterService: TileClusterSearchService,
        eventBus: EventBus
    ) {
        super();

        this._board = board;

        this._boardFillService = boardFillService;
        this._tileClusterService = tileClusterService;

        this._eventBus = eventBus;

        this._boardFillService.fillRandom(this._board);
        this.subscribe();
    }

    private subscribe(): void {
        this.subscriptions.add(
            this._eventBus.on(TileClickedEvent, this.onTileClicked.bind(this))
        );
    }

    private onTileClicked(event: TileClickedEvent): void {
        const cluster = this._tileClusterService.findCluster(this._board, event.x, event.y);

        if (!cluster) {
            console.log("No cluster");
            return;
        }

        console.log(`Cluster found: size=${cluster.size}, type=${cluster.type}`);
    }
}