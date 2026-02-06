import { EventBus } from "../../../../core/eventbus/EventBus";
import { VisualConfig } from "../../../config/visual/VisualConfig";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TileType } from "../../../domain/board/models/TileType";
import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { TileDestructionFx } from "../fx/TileDestructionFx";
import { TileFlashFx } from "../fx/TileFlashFx";
import { TileViewHolder } from "./TileViewHolder";
import { TileVisualAgent } from "./TileVisualAgent";

export class TileVisualAgentFactory {

    constructor(
        private readonly _visualConfig: VisualConfig,
        private readonly _eventBus: EventBus,
        private readonly _tweenSystem: TweenSystem,
        private readonly _pool: TileViewHolder,
        private readonly _boardCols: number,
        private readonly _boardRows: number,
        private readonly _tileLayer: cc.Node,
        private readonly _destructionFx: TileDestructionFx,
        private readonly _flashFx: TileFlashFx
    ) { }

    public create(id: TileId, type: TileType): TileVisualAgent {
        const view = this._pool.pull(id, type);
        return new TileVisualAgent(
            this._visualConfig,
            this._eventBus,
            this._tweenSystem,
            id,
            view,
            type,
            this._boardCols,
            this._boardRows,
            this._tileLayer,
            this._destructionFx,
            this._flashFx
        );
    }
}