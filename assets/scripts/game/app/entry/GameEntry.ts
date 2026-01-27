import { assertNotNull } from "../../../core/utils/assert";
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

    private _config: GameConfig | null = null;
    private _context: GameContext | null = null;

    protected async start() {
        assertNotNull(this.boardView, this, "BoardView");
        
        this._config = await new GameConfigLoader().load(this.configMode);
        this._context = new GameContext(this._config);
        this._context.init();

        this.boardView.init(this._context.eventBus, this._context.boardModel);
    }

    protected onDestroy(): void {
        this._context?.dispose();
    }
}