import { assertNotNull } from "../../../core/utils/assert";
import { GameConfig } from "../../config/GameConfig";
import { GameConfigLoader } from "../../config/GameConfigLoader";
import { GameConfigSource } from "../../config/GameConfigSource";
import { BaseView } from "../../presentation/views/BaseView";
import { BoardView } from "../../presentation/views/BoardView";
import { GameContext } from "../context/GameContext";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameEntry extends BaseView {
    @property({ type: cc.Enum(GameConfigSource) })
    configMode: GameConfigSource = GameConfigSource.DEFAULT;

    @property(BoardView)
    boardView!: BoardView;

    private _config!: GameConfig;
    private _context!: GameContext;

     protected validate(): void {
        assertNotNull(this.boardView, this, "BoardView");
    }

    protected async start() {        
        this._config = await new GameConfigLoader().load(this.configMode);
        this._context = new GameContext(this._config);
        this._context.init();

        this.boardView.init(this._context.eventBus, this._context.boardModel);
    }

    protected onDestroy(): void {
        this._context?.dispose();
    }
}