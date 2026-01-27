import { EventBus } from "../../../../core/event-system/EventBus";
import { SubscriptionGroup } from "../../../../core/event-system/SubscriptionGroup";
import { GameConfig } from "../../../config/GameConfig";
import { BoardProcessedEvent } from "../../../domain/board/events/BoardProcessedEvent";
import { BoardStartedProcessingEvent as BoardProcessingEvent } from "../../../domain/board/events/BoardStartedProcessingEvent";
import { GameStateChangedEvent } from "../../../domain/state/events/GameStateChangedEvent";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { GameStateType } from "../../../domain/state/models/GameStateType";
import { ScoreService } from "../../../domain/state/services/ScoreService";
import { BoardSyncedEvent } from "../../../presentation/events/BoardSyncedEvent";
import { TileClickedEvent } from "../../../presentation/events/TileClickedEvent";
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
        this.gameStateModel.setState(GameStateType.PROCESSING);
    }

    private onBoardProcessed = (event: BoardProcessedEvent): void => {
        if (event.destroyed.length < 1) {
            this.gameStateModel.setState(GameStateType.IDLE);
            return;
        }

        this.gameStateModel.addScore(this.scoreService.calculate(event.destroyed.length));
        this.gameStateModel.useMove();
        this.eventBus.emit(new GameStateChangedEvent());
        this.gameStateModel.setState(GameStateType.ANIMATING);
    };

    private onBoardSynced = (event: BoardSyncedEvent): void => {
        this.gameStateModel.setState(GameStateType.IDLE);
    }

    public dispose(): void {
        this._subscriptions.clear();
    }
}