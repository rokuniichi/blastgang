import { GameConfigLoader } from "../../config/GameConfigLoader";
import { GameConfigSource } from "../../config/GameConfigSource";
import { GameContext } from "../context/GameContext";
import { BoardView } from "../../presentation/views/BoardView";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameEntry extends cc.Component {

    @property({ type: cc.Enum(GameConfigSource) })
    public configMode: GameConfigSource = GameConfigSource.DEFAULT;

    @property(BoardView)
    public boardView: BoardView = null!;

    private ctx: GameContext | null = null;

    protected async start(): Promise<void> {
        const config = await new GameConfigLoader().load(this.configMode);

        this.ctx = new GameContext(config);
        this.ctx.init();

        this.boardView.init({
                eventBus: this.ctx.eventBus,
                board: this.ctx.board
            });
    }

    protected onDestroy(): void {
        if (this.ctx !== null) {
            this.ctx.dispose();
            this.ctx = null;
        }
    }
}