import { GameConfigLoader } from "../../config/GameConfigLoader";
import { GameConfigSource } from "../../config/GameConfigSource";
import { BoardView } from "../../presentation/views/BoardView";
import { GameContext } from "../context/GameContext";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameEntry extends cc.Component {

    @property({ type: cc.Enum(GameConfigSource) })
    configMode: GameConfigSource = GameConfigSource.DEFAULT;

    @property(BoardView)
    boardView: BoardView | null = null;

    protected async start() {
        const config = await new GameConfigLoader().load(this.configMode);
        const context = new GameContext(config);

        this.boardView.init(context.boardModel, context.gameEventBus);
    }
}