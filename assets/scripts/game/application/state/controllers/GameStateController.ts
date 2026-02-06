import { EventBus } from "../../../../core/eventbus/EventBus";
import { GameStateInfo } from "../../../config/game/GameConfig";
import { DomainGraph } from "../../../domain/DomainGraph";
import { GameStateSync } from "../../../domain/state/events/GameStateSync";
import { MovesUpdate } from "../../../domain/state/events/MovesUpdate";
import { ScoreUpdate } from "../../../domain/state/events/ScoreUpdate";
import { StateUpdate } from "../../../domain/state/events/StateUpdate";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { GameStateType } from "../../../domain/state/models/GameStateType";
import { ScoreService } from "../../../domain/state/services/ScoreService";
import { EventController } from "../../common/controllers/BaseController";

export class GameStateController extends EventController {
    private readonly _stateInfo: GameStateInfo;
    private readonly _gameStateModel: GameStateModel;
    private readonly _scoreService: ScoreService;

    public constructor(eventBus: EventBus, domain: DomainGraph) {
        super(eventBus);

        this._stateInfo = domain.stateInfo;
        this._gameStateModel = domain.gameStateModel;
        this._scoreService = domain.scoreService;
    }

    protected onInit(): void {
        this._gameStateModel.setState(GameStateType.PLAYING);
        this.on(GameStateSync, this.onSync);
    }

    private onSync = (event: GameStateSync): void => {
        if (event.destroyed < 1) {
            return;
        }

        const state = this._gameStateModel.state;
        const score = this._gameStateModel.currentScore;
        const moves = this._gameStateModel.movesLeft;

        console.log(`[GAME STATE] BEFORE ${GameStateType[state]}, ${score}, ${moves}`)

        this._gameStateModel.addScore(this._scoreService.calculate(event.destroyed));
        if (this._gameStateModel.currentScore >= this._gameStateModel.targetScore)
            this._gameStateModel.setState(GameStateType.WON);

        this._gameStateModel.useMove();
        if (this._gameStateModel.movesLeft === 0 && this._gameStateModel.state !== GameStateType.WON)
            this._gameStateModel.setState(GameStateType.LOST)

        if (score !== this._gameStateModel.currentScore)
            this.emit(new ScoreUpdate(this._gameStateModel.currentScore));

        if (moves !== this._gameStateModel.movesLeft)
            this.emit(new MovesUpdate(this._gameStateModel.movesLeft));

        if (state !== this._gameStateModel.state)
            this.emit(new StateUpdate(this._gameStateModel.state));

        console.log(`[GAME STATE] AFTER ${GameStateType[this._gameStateModel.state]}, ${this._gameStateModel.currentScore}, ${this._gameStateModel.movesLeft}`)
    };
}