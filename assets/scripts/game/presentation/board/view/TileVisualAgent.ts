import { BoardRuntimeModel, TileRuntimeState } from "../../../application/board/runtime/BoardRuntimeModel";
import { TileId } from "../../../domain/board/models/BoardLogicalModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileType } from "../../../domain/board/models/TileType";
import { AnimationHelper } from "../animations/BoardAnimationHelper";
import { TileView } from "./TileView";

export class TileVisualAgent {

    public readonly id: TileId;

    private readonly _runtimeModel: BoardRuntimeModel;
    private readonly _animationHelper: AnimationHelper;

    private readonly _view: TileView;
    private readonly _boardWidth: number;
    private readonly _boardHeight: number;
    private readonly _nodeWidth: number;
    private readonly _nodeHeight: number;

    private currentTween?: Promise<void>;
    private currentTarget?: TilePosition;

    private busy = false;

    constructor(
        runtimeModel: BoardRuntimeModel,
        animationHelper: AnimationHelper,
        tileId: string,
        view: TileView,
        boardWidth: number,
        boardHeight: number
    ) {
        this._runtimeModel = runtimeModel;
        this._animationHelper = animationHelper;

        this.id = tileId;

        this._view = view;
        this._boardWidth = boardWidth;
        this._boardHeight = boardHeight;
        this._nodeWidth = view.node.width;
        this._nodeHeight = view.node.height;
    }

    spawn(type: TileType, at: TilePosition): void {
        this._view.set(type);
        this._view.position = at;
        this._view.node.setPosition(this.getLocal(at));
        this._view.node.active = true;
        this._runtimeModel.set(this.id, TileRuntimeState.IDLE);
    }

    /* move(to: TilePosition): void {
        this.startMove(to);
    }

    retargetMove(to: TilePosition): void {
        if (!this.busy) {
            this.startMove(to);
            return;
        }

        this.stopTween();
        this.startMove(to);
    } */

    destroy(): void {
        this.busy = true;
        const sequence = async () => {
            await this._animationHelper.destroy(this._view.node);
            this._runtimeModel.delete(this.id);
        };
        sequence();
    }

    isBusy(): boolean {
        return this.busy;
    }

    // ===== PRIVATE =====

    /*   private startMove(to: TilePosition) {
          this.busy = true;
          this.currentTarget = to;
  
          const worldPos = BoardCoords.toWorld(to);
  
          this.currentTween = cc.tween(this._node)
              .to(0.25, { position: worldPos })
              .call(() => {
                  this.busy = false;
                  this.currentTween = undefined;
              })
              .start();
      }
  
      private stopTween() {
          if (this.currentTween) {
              this.currentTween.stop();
              this.currentTween = undefined;
          }
      } */

    private playDestroyFx() {
        // fx / particles / shake / etc
    }

    private getLocal(position: TilePosition): cc.Vec2 {
        const originX = -((this._boardWidth - 1) * this._nodeWidth) / 2;
        const originY = ((this._boardHeight - 1) * this._nodeHeight) / 2;

        return cc.v2(originX + position.x * this._nodeWidth, originY - position.y * this._nodeHeight);
    }
}
