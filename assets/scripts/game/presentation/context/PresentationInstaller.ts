import { assertNotNull } from "../../../core/utils/assert";
import { BoardView } from "../board/view/BoardView";
import { PresentationContext } from "./PresentationContext";
import { MovesTextView } from "../state/view/MovesTextView";
import { ScoreTextView } from "../state/view/ScoreTextView";
import { AnimationSystem } from "../core/animations/AnimationSystem";
import { ContextView } from "../core/view/ContextView";

const { ccclass, property } = cc._decorator;

@ccclass
export class PresentationInstaller extends ContextView<PresentationContext> {
    @property(BoardView)
    private boardView: BoardView = null!;

    @property(MovesTextView)
    private movesTextView: MovesTextView = null!;

    @property(ScoreTextView)
    private scoreTextView: ScoreTextView = null!;

    private animationSystem!: AnimationSystem;

    protected onLoad(): void {
        assertNotNull(this.boardView, this, "BoardView");
        assertNotNull(this.movesTextView, this, "MovesTextView");
        assertNotNull(this.scoreTextView, this, "ScoreTextView");
    }

    protected preInit(): void {
        assertNotNull(this.context, this, "viewContext");
    }

    protected onInit(): void {
        this.animationSystem = new AnimationSystem();

        this.boardView.init({
            eventBus: this.context.eventBus,
            boardRuntime: this.context.boardRuntime,
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