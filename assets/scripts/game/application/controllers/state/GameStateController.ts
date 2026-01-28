import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { GameConfig } from "../../config/GameConfig";
import { BoardProcessedEvent } from "../../../domain/board/events/BoardProcessedEvent";
import { BoardProcessingEvent } from "../../../domain/board/events/BoardProcessingEvent";
import { MovesUpdatedEvent } from "../../../domain/state/events/MovesUpdatedEvent";
import { ScoreUpdatedEvent } from "../../../domain/state/events/ScoreUpdatedEvent";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { ScoreService } from "../../../domain/state/services/ScoreService";
import { BoardSyncedEvent } from "../../../presentation/events/BoardSyncedEvent";
import { GameContext } from "../../context/GameContext";
import { BaseController } from "../BaseController";

export class GameStateController extends BaseController {

    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    private readonly config: GameConfig;
    private readonly eventBus: EventBus;
    private readonly gameStateModel: GameStateModel;
    private readonly scoreService: ScoreService;

    public constructor(context: GameContext) {
        super();

        this.config = context.gameConfig;
        this.eventBus = context.eventBus;
        this.gameStateModel = context.gameStateModel;
        this.scoreService = context.scoreService;
    }

    protected onInit(): void {
        this._subscriptions.add(
            this.eventBus.on(BoardProcessedEvent, this.onBoardProcessed)
        );

        this._subscriptions.add(
            this.eventBus.on(BoardSyncedEvent, this.onBoardSynced)
        )

        this._subscriptions.add(
            this.eventBus.on(BoardProcessingEvent, this.onBoardProcessing)
        )
    }

    private onBoardProcessing = (event: BoardProcessingEvent): void => {
        this.gameStateModel.setState("PROCESSING");
    }

    private onBoardProcessed = (event: BoardProcessedEvent): void => {
        if (event.destroyed.length < 1) {
            this.gameStateModel.setState("IDLE");
            return;
        }

        this.gameStateModel.addScore(this.scoreService.calculate(event.destroyed.length));
        this.gameStateModel.useMove();
        this.eventBus.emit(new ScoreUpdatedEvent(this.gameStateModel.currentScore));
        this.eventBus.emit(new MovesUpdatedEvent(this.gameStateModel.movesLeft));
        this.gameStateModel.setState("ANIMATING");
    };

    private onBoardSynced = (event: BoardSyncedEvent): void => {
        this.gameStateModel.setState("IDLE");
    }

    public dispose(): void {
        this._subscriptions.clear();
    }
}