import { BoardModel } from "../../domain/models/BoardModel";
import { BoardFillService } from "../../domain/services/BoardFillService";
import { EventBus } from "../../../core/event-system/EventBus";
import { BaseController } from "./BaseController";
import { TileClickedEvent } from "../../presentation/events/TileClickedEvent";

export class BoardController extends BaseController {

    private readonly _board: BoardModel;
    private readonly _boardFillService: BoardFillService;
    private readonly _eventBus: EventBus;

    constructor(
        board: BoardModel,
        boardFillService: BoardFillService,
        eventBus: EventBus
    ) {
        super();

        this._board = board;
        this._boardFillService = boardFillService;
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
        console.log(`[${this.constructor.name}]] Tile clicked: x=${event.x}, y=${event.y}`);
    }
}