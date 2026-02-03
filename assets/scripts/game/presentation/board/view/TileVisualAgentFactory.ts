import { BoardRuntimeModel } from "../../../application/board/runtime/BoardRuntimeModel";
import { AnimationHelper } from "../animations/BoardAnimationHelper";
import { TileViewPool } from "./TileViewPool";
import { TileVisualAgent } from "./TileVisualAgent";

export class TileVisualAgentFactory {

    constructor(
        private readonly _runtimeModel: BoardRuntimeModel,
        private readonly _animationHelper: AnimationHelper,
        private readonly _pool: TileViewPool,
        private readonly _boardWidth: number,
        private readonly _boardHeight: number
    ) { }

    public create(tileId: string): TileVisualAgent {
        const view = this._pool.pull();
        return new TileVisualAgent(
            this._runtimeModel,
            this._animationHelper,
            tileId,
            view,
            this._boardWidth,
            this._boardHeight
        );
    }
}