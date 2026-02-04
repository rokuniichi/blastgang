import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { DomainContext } from "../../../domain/context/DomainContext";
import { GameStateSync } from "../../../domain/state/events/GameStateSync";
import { MovesUpdate } from "../../../domain/state/events/MovesUpdate";
import { ScoreUpdate } from "../../../domain/state/events/ScoreUpdate";
import { StateUpdate } from "../../../domain/state/events/StateUpdate";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { GameStateType } from "../../../domain/state/models/GameStateType";
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
        this._gameStateModel.setState(GameStateType.PLAYING);
        this._subscriptions.add(
            this._eventBus.on(GameStateSync, this.onBoardProcessed)
        );
    }

    private onBoardProcessed = (event: GameStateSync): void => {
        if (event.destroyed < 1) {
            return;
        }

        const state = this._gameStateModel.state;
        const score = this._gameStateModel.currentScore;
        const moves = this._gameStateModel.movesLeft;

        this._gameStateModel.addScore(this._scoreService.calculate(event.destroyed));
        if (this._gameStateModel.currentScore >= this._gameStateModel.targetScore)
            this._gameStateModel.setState(GameStateType.WON);

        this._gameStateModel.useMove();
        if (this._gameStateModel.movesLeft === 0 && this._gameStateModel.state !== GameStateType.WON)
            this._gameStateModel.setState(GameStateType.LOST)

        if (score !== this._gameStateModel.currentScore)
            this._eventBus.emit(new ScoreUpdate(this._gameStateModel.currentScore));

        if (moves !== this._gameStateModel.movesLeft)
            this._eventBus.emit(new MovesUpdate(this._gameStateModel.movesLeft));

        if (state !== this._gameStateModel.state)
            this._eventBus.emit(new StateUpdate(this._gameStateModel.state));
    };

    public dispose(): void {
        this._subscriptions.clear();
    }
}