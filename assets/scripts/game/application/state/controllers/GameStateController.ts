import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { DomainContext } from "../../../domain/context/DomainContext";
import { GameStateSync } from "../../../domain/state/events/GameStateSync";
import { MovesUpdate } from "../../../domain/state/events/MovesUpdate";
import { ScoreUpdate } from "../../../domain/state/events/ScoreUpdate";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { ScoreService } from "../../../domain/state/services/ScoreService";
import { GameConfig } from "../../common/config/game/GameConfig";
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
            this._eventBus.on(GameStateSync, this.onBoardProcessed)
        );
    }

    private onBoardProcessed = (event: GameStateSync): void => {
        if (event.destroyed < 1) {
            return;
        }

        this._gameStateModel.addScore(this._scoreService.calculate(event.destroyed));
        this._gameStateModel.useMove();
        this._eventBus.emit(new ScoreUpdate(this._gameStateModel.currentScore));
        this._eventBus.emit(new MovesUpdate(this._gameStateModel.movesLeft));
    };

    public dispose(): void {
        this._subscriptions.clear();
    }
}