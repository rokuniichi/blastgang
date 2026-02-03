import { assertNotNull } from "../../../core/utils/assert";
import { BoardView } from "../board/view/BoardView";
import { TweenHelper } from "../common/animations/TweenHelper";
import { ContextView } from "../common/view/ContextView";
import { MovesTextView } from "../state/view/MovesTextView";
import { ScoreTextView } from "../state/view/ScoreTextView";
import { PresentationContext } from "./PresentationContext";

const { ccclass, property } = cc._decorator;

@ccclass
export class PresentationInstaller extends ContextView<PresentationContext> {
    @property(BoardView)
    private boardView: BoardView = null!;

    @property(MovesTextView)
    private movesTextView: MovesTextView = null!;

    @property(ScoreTextView)
    private scoreTextView: ScoreTextView = null!;

    private animationSystem!: TweenHelper;

    protected onLoad(): void {
        assertNotNull(this.boardView, this, "BoardView");
        assertNotNull(this.movesTextView, this, "MovesTextView");
        assertNotNull(this.scoreTextView, this, "ScoreTextView");
    }

    protected override preInit(): void {
        assertNotNull(this.context, this, "viewContext");
    }

    protected onInit(): void {
        this.animationSystem = new TweenHelper();

        this.boardView.init({
            visualConfig: this.context.visualConfig,
            eventBus: this.context.eventBus,
            runtimeModel: this.context.boardRuntime,
            animationSystem: this.animationSystem,
            boardWidth: this.context.boardWidth,
            boardHeight: this.context.boardHeight,
            initialBoard: this.context.initialBoard
        });

        this.scoreTextView.init({
            eventBus: this.context.eventBus,
            initialValue: this.context.currentScore,
            targetScore: this.context.targetScore
        });

        this.movesTextView.init({
            eventBus: this.context.eventBus,
            initialValue: this.context.movesLeft
        });
    }

    public dispose(): void {
        this.boardView.dispose();
        this.movesTextView.dispose();
        this.scoreTextView.dispose();
    }
}