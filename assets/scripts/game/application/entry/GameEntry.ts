import { assertNotNull } from "../../../core/utils/assert";
import { GameConfigLoader } from "../../config/GameConfigLoader";
import { GameConfigSource } from "../../config/GameConfigSource";
import { AnimationSystem } from "../../presentation/animation-system/AnimationSystem";
import { BoardView } from "../../presentation/views/BoardView";
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
            board: this.context.board,
            animationSystem: this.animationSystem
        });
    }

    protected onDestroy(): void {
        if (this.context !== null) {
            this.context.dispose();
            this.context = null;
        }
    }
}