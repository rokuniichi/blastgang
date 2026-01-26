import { GameConfig } from "../../config/GameConfig";
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

    private _config: GameConfig;
    private _context: GameContext;

    protected async start() {
        this._config = await new GameConfigLoader().load(this.configMode);
        this._context = new GameContext(this._config);
        this.boardView.init(this._context.boardModel, this._context.eventBus);
    }

    protected onDestroy(): void {
        this._context?.dispose();
    }
}