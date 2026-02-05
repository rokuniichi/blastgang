import { EventBus } from "../../../../core/events/EventBus";
import { VisualConfig } from "../../../config/visual/VisualConfig";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TileType } from "../../../domain/board/models/TileType";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { TileDestructionFx } from "../fx/TileDestructionFx";
import { TileFlashFx } from "../fx/TileFlashFx";
import { TileViewPool } from "./TileViewPool";
import { TileVisualAgent } from "./TileVisualAgent";

export class TileVisualAgentFactory {

    constructor(
        private readonly _visualConfig: VisualConfig,
        private readonly _eventBus: EventBus,
        private readonly _tweenHelper: TweenHelper,
        private readonly _pool: TileViewPool,
        private readonly _boardCols: number,
        private readonly _boardRows: number,
        private readonly _backgroundLayer: cc.Node,
        private readonly _tileLayer: cc.Node,
        private readonly _fxLayer: cc.Node,
        private readonly _destructionFx: TileDestructionFx,
        private readonly _flashFx: TileFlashFx
    ) { }

    public create(id: TileId, type: TileType): TileVisualAgent {
        const view = this._pool.pull(id, type);
        return new TileVisualAgent(
            this._visualConfig,
            this._eventBus,
            this._tweenHelper,
            id,
            view,
            type,
            this._boardCols,
            this._boardRows,
            this._backgroundLayer,
            this._tileLayer,
            this._fxLayer,
            this._destructionFx,
            this._flashFx
        );
    }
}