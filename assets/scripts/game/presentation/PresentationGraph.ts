import { EventBus } from "../../core/events/EventBus";
import { GameConfig } from "../config/game/GameConfig";
import { VisualConfig } from "../config/visual/VisualConfig";
import { DomainGraph } from "../domain/DomainGraph";
import { TweenHelper } from "./common/animations/TweenHelper";

export class PresentationGraph {
    public readonly visualConfig: VisualConfig;
    public readonly eventBus: EventBus;
    public readonly tweenHelper: TweenHelper;
    public readonly movesLeft: number;
    public readonly targetScore: number;
    public readonly currentScore: number;
    public readonly boardCols: number;
    public readonly boardRows: number;

    public constructor(eventBus: EventBus, visualConfig: VisualConfig, gameConfig: GameConfig, domain: DomainGraph) {
        this.visualConfig = visualConfig;
        this.eventBus = eventBus;
        this.tweenHelper = new TweenHelper();
        this.movesLeft = domain.gameStateModel.movesLeft;
        this.targetScore = domain.gameStateModel.targetScore;
        this.currentScore = domain.gameStateModel.currentScore;
        this.boardCols = gameConfig.board.cols;
        this.boardRows = gameConfig.board.rows;
    }
}