import { assertNotNull } from "../../../core/utils/assert";
import { GameConfigLoader } from "../../config/GameConfigLoader";
import { GameConfigSource } from "../../config/GameConfigSource";
import { AnimationSystem } from "../../presentation/animations/AnimationSystem";
import { BoardView } from "../../presentation/views/BoardView";
import { GameView } from "../../presentation/views/GameView";
import { GameContext } from "../context/GameContext";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameEntry extends cc.Component {

    @property({ type: cc.Enum(GameConfigSource) })
    private configMode: GameConfigSource = GameConfigSource.DEFAULT;

    @property(AnimationSystem)
    private animationSystem: AnimationSystem = null!;

    @property(BoardView)
    private boardView: BoardView = null!;

    @property(GameView)
    private gameView: GameView = null!;

    private context: GameContext | null = null;

    protected onLoad(): void {
        assertNotNull(this.animationSystem, this, "AnimationSystem");
        assertNotNull(this.boardView, this, "BoardView");
    }

    protected async start(): Promise<void> {
        const config = await new GameConfigLoader().load(this.configMode);

        this.context = new GameContext(config);
        this.context.init();

        this.boardView.init({
            eventBus: this.context.eventBus,
            boardModel: this.context.boardModel,
            animationSystem: this.animationSystem
        });

        this.gameView.init({
            eventBus: this.context.eventBus,
            gameStateModel: this.context.gameStateModel
        })
    }

    protected onDestroy(): void {
        if (this.context !== null) {
            this.context.dispose();
            this.context = null;
        }
    }
}