import { EventBus } from "../../../../core/events/EventBus";
import { VisualConfig } from "../../../config/visual/VisualConfig";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TweenHelper } from "../../common/animations/TweenHelper";
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
    ) { }

    public create(id: TileId): TileVisualAgent {
        const view = this._pool.pull(id);
        return new TileVisualAgent(
            this._visualConfig,
            this._eventBus,
            this._tweenHelper,
            id,
            view,
            this._boardCols,
            this._boardRows,
            this._backgroundLayer,
            this._tileLayer,
            this._fxLayer
        );
    }
}