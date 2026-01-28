import { assertNotNull } from "../../../core/utils/assert";
import { AnimationSystem } from "../animations/AnimationSystem";
import { BoardView } from "../board/view/BoardView";
import { ContextView } from "../core/view/ContextView";
import { MovesTextView } from "../state/view/MovesTextView";
import { ScoreTextView } from "../state/view/ScoreTextView";
import { ViewInstallerContext } from "./ViewInstallerContext";

const { ccclass, property } = cc._decorator;

@ccclass
export class ViewInstaller extends ContextView<ViewInstallerContext> {

    @property(AnimationSystem)
    private animationSystem: AnimationSystem = null!;

    @property(BoardView)
    private boardView: BoardView = null!;

    @property(MovesTextView)
    private movesTextView: MovesTextView = null!;

    @property(ScoreTextView)
    private scoreTextView: ScoreTextView = null!;

    onLoad(): void {
        assertNotNull(this.animationSystem, this, "AnimationSystem");
        assertNotNull(this.boardView, this, "BoardView");
        assertNotNull(this.movesTextView, this, "MovesTextView");
        assertNotNull(this.scoreTextView, this, "ScoreTextView");
    }

    protected onInit(): void {
        this.boardView.init({
            eventBus: this.context.eventBus,
            boardModel: this.context.boardModel,
            animationSystem: this.animationSystem
        });

        this.scoreTextView.init({
            eventBus: this.context.eventBus,
            initialValue: 0,
            targetScore: this.context.gameStateModel.targetScore
        });

        this.movesTextView.init({
            eventBus: this.context.eventBus,
            initialValue: this.context.gameStateModel.movesLeft
        });
    }

    public dispose(): void {
        this.boardView.dispose();
        this.movesTextView.dispose();
        this.scoreTextView.dispose();
    }
}