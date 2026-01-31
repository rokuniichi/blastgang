import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { BoardProcessResult } from "../../../domain/board/events/BoardProcessResult";
import { DomainContext } from "../../../domain/context/DomainContext";
import { MovesUpdatedEvent } from "../../../domain/state/events/MovesUpdatedEvent";
import { ScoreUpdatedEvent } from "../../../domain/state/events/ScoreUpdatedEvent";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { ScoreService } from "../../../domain/state/services/ScoreService";
import { GameConfig } from "../../common/config/GameConfig";
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
    }

    private onBoardProcessed = (event: BoardProcessResult): void => {
        if (event.instructions.destroyed.length < 1) {
            return;
        }

        this._gameStateModel.addScore(this._scoreService.calculate(event.instructions.destroyed.length));
        this._gameStateModel.useMove();
        this._eventBus.emit(new ScoreUpdatedEvent(this._gameStateModel.currentScore));
        this._eventBus.emit(new MovesUpdatedEvent(this._gameStateModel.movesLeft));
    };

    public dispose(): void {
        this._subscriptions.clear();
    }
}