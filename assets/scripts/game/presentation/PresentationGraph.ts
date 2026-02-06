import { EventBus } from "../../core/eventbus/EventBus";
import { GameConfig } from "../config/game/GameConfig";
import { VisualConfig } from "../config/visual/VisualConfig";
import { DomainGraph } from "../domain/DomainGraph";
import { TweenHelper } from "./common/animations/TweenHelper";
import { TweenSystem } from "./common/animations/tweens/TweenSystem";

export class PresentationGraph {
    public readonly visualConfig: VisualConfig;
    public readonly eventBus: EventBus;
    public readonly tweenSystem: TweenSystem;
    public readonly movesLeft: number;
    public readonly targetScore: number;
    public readonly currentScore: number;
    public readonly boardCols: number;
    public readonly boardRows: number;

    public constructor(eventBus: EventBus, visualConfig: VisualConfig, gameConfig: GameConfig, domain: DomainGraph) {
        this.visualConfig = visualConfig;
        this.eventBus = eventBus;
        this.tweenSystem = new TweenSystem();
        this.movesLeft = domain.gameStateModel.movesLeft;
        this.targetScore = domain.gameStateModel.targetScore;
        this.currentScore = domain.gameStateModel.currentScore;
        this.boardCols = gameConfig.board.cols;
        this.boardRows = gameConfig.board.rows;
    }
}