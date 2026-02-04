import { assertNotNull } from "../../../core/utils/assert";
import { PresentationReady } from "../board/events/PresentationReady";
import { BoardView } from "../board/view/BoardView";
import { TweenHelper } from "../common/animations/TweenHelper";
import { EventView } from "../common/view/EventView";
import { LoadingScreen } from "../loading/LoadingScreen";
import { MovesTextView } from "../state/view/MovesTextView";
import { ScoreTextView } from "../state/view/ScoreTextView";
import { PresentationContext } from "./PresentationContext";

const { ccclass, property } = cc._decorator;

@ccclass
export class PresentationInstaller extends EventView<PresentationContext> {
    @property(LoadingScreen)
    private loadingScreen: LoadingScreen = null!;

    @property(BoardView)
    private boardView: BoardView = null!;

    @property(MovesTextView)
    private movesTextView: MovesTextView = null!;

    @property(ScoreTextView)
    private scoreTextView: ScoreTextView = null!;    

    private tweenHelper!: TweenHelper;

    protected onLoad(): void {
        assertNotNull(this.boardView, this, "BoardView");
        assertNotNull(this.movesTextView, this, "MovesTextView");
        assertNotNull(this.scoreTextView, this, "ScoreTextView");
    }

    protected override preInit(): void {
        assertNotNull(this.context, this, "viewContext");
    }

    protected onInit(): void {
        this.tweenHelper = new TweenHelper();

        this.loadingScreen.init({
            eventBus: this.context.eventBus,
            tweenHelper: this.tweenHelper
        });

        this.boardView.init({
            visualConfig: this.context.visualConfig,
            eventBus: this.context.eventBus,
            runtimeModel: this.context.boardRuntime,
            tweenHelper: this.tweenHelper,
            boardCols: this.context.boardCols,
            boardRows: this.context.boardRows,
            initialBoard: this.context.initialBoard
        });

        this.movesTextView.init({
            eventBus: this.context.eventBus,
            initialValue: this.context.movesLeft
        });

        this.scoreTextView.init({
            eventBus: this.context.eventBus,
            initialValue: this.context.currentScore,
            targetScore: this.context.targetScore
        });
    }

    protected postInit(): void {
        this.emit(new PresentationReady());
    }

    public dispose(): void {
        this.boardView.dispose();
        this.movesTextView.dispose();
        this.scoreTextView.dispose();
    }
}