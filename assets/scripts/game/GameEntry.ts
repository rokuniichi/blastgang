import { GameConfigMode }    from "./configs/GameConfigMode";
import { GameConfigService } from "./configs/GameConfigService";
import { GameContext }       from "./context/GameContext";
import { BoardView }         from "../ui/views/BoardView";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameEntry extends cc.Component {

    @property({ type: cc.Enum(GameConfigMode) })
    configMode: GameConfigMode = GameConfigMode.DEFAULT;

    @property(BoardView)
    boardView: BoardView | null = null;

    protected async start() {
        const config = await new GameConfigService().load(this.configMode);
        const context = new GameContext(config);

        this.boardView.init(context.boardModel, context.gameEventBus);
    }
}