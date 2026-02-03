import { EventBus } from "../../../../core/events/EventBus";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { TileViewPool } from "./TileViewPool";
import { TileVisualAgent } from "./TileVisualAgent";

export class TileVisualAgentFactory {

    constructor(
        private readonly _eventBus: EventBus,
        private readonly _tweenHelper: TweenHelper,
        private readonly _pool: TileViewPool,
        private readonly _boardWidth: number,
        private readonly _boardHeight: number,
        private readonly _backgroundLayer: cc.Node,
        private readonly _tileLayer: cc.Node,
        private readonly _fxLayer: cc.Node,
    ) { }

    public create(tileId: string): TileVisualAgent {
        const view = this._pool.pull();
        return new TileVisualAgent(
            this._eventBus,
            this._tweenHelper,
            tileId,
            view,
            this._boardWidth,
            this._boardHeight,
            this._backgroundLayer,
            this._tileLayer,
            this._fxLayer
        );
    }
}