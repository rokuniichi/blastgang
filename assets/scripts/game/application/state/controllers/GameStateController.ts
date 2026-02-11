import { EventBus } from "../../../../core/eventbus/EventBus";
import { GameStateInfo } from "../../../config/game/GameConfig";
import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { DomainGraph } from "../../../domain/DomainGraph";
import { NormalIntentComplete } from "../events/NormalIntentComplete";
import { MovesUpdate } from "../events/MovesUpdate";
import { ScoreUpdate } from "../events/ScoreUpdate";
import { StateUpdate } from "../events/StateUpdate";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { GameStateType } from "../../../domain/state/models/GameStateType";
import { ScoreService } from "../../../domain/state/services/ScoreService";
import { EventController } from "../../common/controllers/BaseController";
import { BoosterIntentComplete } from "../events/BoosterIntentComplete";
import { BoosterUsed } from "../events/BoosterUsed";

export class GameStateController extends EventController {
    private readonly _stateInfo: GameStateInfo;
    private readonly _gameStateModel: GameStateModel;
    private readonly _scoreService: ScoreService;

    public constructor(eventBus: EventBus, domain: DomainGraph) {
        super(eventBus);

        this._stateInfo = domain.stateInfo;
        this._gameStateModel = domain.stateModel;
        this._scoreService = domain.scoreService;
    }

    protected onInit(): void {
        this._gameStateModel.setState(GameStateType.PLAYING);
        this.on(NormalIntentComplete, this.onNormalComplete);
        this.on(BoosterIntentComplete, this.onBoosterComplete);
    }

    private onNormalComplete = (event: NormalIntentComplete): void => {
        const state = this._gameStateModel.state;
        const score = this._gameStateModel.currentScore;
        const moves = this._gameStateModel.movesLeft;

        this.calculateScore(event);

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

    };

    private onBoosterComplete = (event: BoosterIntentComplete): void => {
        this._gameStateModel.useBooster(event.type);
        const booster = this._gameStateModel.getBooster(event.type);
        this.emit(new BoosterUsed(event.type, booster));
    };


    private calculateScore(sync: NormalIntentComplete) {
        this._gameStateModel.addScore(this._scoreService.calculateCluster(sync.clusterDestroys));
        this._gameStateModel.addScore(this._scoreService.calculateCollateral(sync.collateralDestroys));
    }
}