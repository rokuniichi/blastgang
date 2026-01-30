import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { BoardProcessResult } from "../../../domain/board/events/BoardProcessResult";
import { MovesUpdatedEvent } from "../../../domain/state/events/MovesUpdatedEvent";
import { ScoreUpdatedEvent } from "../../../domain/state/events/ScoreUpdatedEvent";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { ScoreService } from "../../../domain/state/services/ScoreService";
import { BoardSyncedEvent } from "../../../presentation/board/events/BoardSyncedEvent";
import { GameConfig } from "../../common/config/GameConfig";
import { DomainContext } from "../../../domain/context/DomainContext";
import { BaseController } from "../../common/controllers/BaseController";


export class GameStateController extends BaseController {

    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    private readonly _gameConfig: GameConfig;
    private readonly _eventBus: EventBus;
    private readonly _gameStateModel: GameStateModel;
    private readonly _scoreService: ScoreService;

    public constructor(context: DomainContext) {
        super();

        this._gameConfig = context.gameConfig;
        this._eventBus = context.eventBus;
        this._gameStateModel = context.gameStateModel;
        this._scoreService = context.scoreService;
    }

    protected onInit(): void {
        this._subscriptions.add(
            this._eventBus.on(BoardProcessResult, this.onBoardProcessed)
        );

        this._subscriptions.add(
            this._eventBus.on(BoardSyncedEvent, this.onBoardSynced)
        )
    }

    private onBoardProcessed = (event: BoardProcessResult): void => {
        if (event.destroyed.length < 1) {
            return;
        }

        this._gameStateModel.addScore(this._scoreService.calculate(event.destroyed.length));
        this._gameStateModel.useMove();
        this._eventBus.emit(new ScoreUpdatedEvent(this._gameStateModel.currentScore));
        this._eventBus.emit(new MovesUpdatedEvent(this._gameStateModel.movesLeft));
    };

    private onBoardSynced = (event: BoardSyncedEvent): void => {
    }

    public dispose(): void {
        this._subscriptions.clear();
    }
}