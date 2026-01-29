import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { BoardChangedEvent } from "../../../domain/board/events/BoardProcessedEvent";
import { BoardProcessingEvent } from "../../../domain/board/events/BoardProcessingEvent";
import { MovesUpdatedEvent } from "../../../domain/state/events/MovesUpdatedEvent";
import { ScoreUpdatedEvent } from "../../../domain/state/events/ScoreUpdatedEvent";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { ScoreService } from "../../../domain/state/services/ScoreService";
import { BoardSyncedEvent } from "../../../presentation/core/events/BoardSyncedEvent";
import { DomainContext } from "../../context/DomainContext";
import { GameConfig } from "../../core/config/GameConfig";
import { BaseController } from "../../core/controllers/BaseController";


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
            this._eventBus.on(BoardChangedEvent, this.onBoardProcessed)
        );

        this._subscriptions.add(
            this._eventBus.on(BoardSyncedEvent, this.onBoardSynced)
        )

        this._subscriptions.add(
            this._eventBus.on(BoardProcessingEvent, this.onBoardProcessing)
        )
    }

    private onBoardProcessing = (event: BoardProcessingEvent): void => {
        this._gameStateModel.setState("PROCESSING");
    }

    private onBoardProcessed = (event: BoardChangedEvent): void => {
        if (event.destroyed.length < 1) {
            this._gameStateModel.setState("IDLE");
            return;
        }

        this._gameStateModel.addScore(this._scoreService.calculate(event.destroyed.length));
        this._gameStateModel.useMove();
        this._eventBus.emit(new ScoreUpdatedEvent(this._gameStateModel.currentScore));
        this._eventBus.emit(new MovesUpdatedEvent(this._gameStateModel.movesLeft));
        this._gameStateModel.setState("ANIMATING");
    };

    private onBoardSynced = (event: BoardSyncedEvent): void => {
        this._gameStateModel.setState("IDLE");
    }

    public dispose(): void {
        this._subscriptions.clear();
    }
}