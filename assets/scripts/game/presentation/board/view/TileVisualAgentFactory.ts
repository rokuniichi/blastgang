import { EventBus } from "../../../../core/eventbus/EventBus";
import { VisualConfig } from "../../../config/visual/VisualConfig";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TileType } from "../../../domain/board/models/TileType";
import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { RocketFxHolder } from "./RocketFxHolder";
import { TileDestructionFxHolder } from "./TileDestructionFxHolder";
import { TileFlashFxHolder } from "./TileFlashFxHolder";
import { TileViewHolder } from "./TileViewHolder";
import { TileVisualAgent } from "./TileVisualAgent";

export class TileVisualAgentFactory {

    public constructor(
        private readonly _visualConfig: VisualConfig,
        private readonly _eventBus: EventBus,
        private readonly _tweenSystem: TweenSystem,
        private readonly _pool: TileViewHolder,
        private readonly _boardCols: number,
        private readonly _boardRows: number,
        private readonly _tilesLayer: cc.Node,
        private readonly _fxLayer: cc.Node,
        private readonly _destructionFx: TileDestructionFxHolder,
        private readonly _rocketFx: RocketFxHolder,
        private readonly _flashFx: TileFlashFxHolder
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
            this._tilesLayer,
            this._fxLayer,
            this._destructionFx,
            this._rocketFx,
            this._flashFx
        );
    }
}