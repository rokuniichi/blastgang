import { EventBus } from "../../../../core/events/EventBus";
import { TileId } from "../../../domain/board/models/BoardLogicalModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileType } from "../../../domain/board/models/TileType";
import { TweenSettings } from "../../common/animations/settings/TweenSettings";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { VisualTileDestroyed } from "../events/VisualTileDestroyed";
import { VisualTileSpawned } from "../events/VisualTileSpawned";
import { TileView } from "./TileView";

export class TileVisualAgent {

    public readonly id: TileId;
    public readonly view: TileView;

    private readonly _eventBus: EventBus;

    private readonly _tweenHelper: TweenHelper;

    private readonly _boardWidth: number;
    private readonly _boardHeight: number;
    private readonly _nodeWidth: number;
    private readonly _nodeHeight: number;
    private readonly _backgroundLayer: cc.Node;
    private readonly _tileLayer: cc.Node;
    private readonly _fxLayer: cc.Node;

    private currentTween?: cc.Tween;

    private currentPosition?: TilePosition;
    private currentTarget?: TilePosition;


    private busy = false;

    constructor(
        eventBus: EventBus,
        tweenHelper: TweenHelper,
        tileId: string,
        view: TileView,
        boardWidth: number,
        boardHeight: number,
        backgroundLayer: cc.Node,
        tileLayer: cc.Node,
        fxLayer: cc.Node
    ) {
        this._eventBus = eventBus;

        this._tweenHelper = tweenHelper;

        this.id = tileId;
        this.view = view;

        this._boardWidth = boardWidth;
        this._boardHeight = boardHeight;
        this._nodeWidth = view.node.width;
        this._nodeHeight = view.node.height;
        this._backgroundLayer = backgroundLayer;
        this._tileLayer = tileLayer;
        this._fxLayer = fxLayer;
    }

    public spawn(type: TileType, at: TilePosition): void {
        this.view.set(type);
        this.view.position = at;
        this.view.node.setPosition(this.getLocal(at));
        this.view.node.active = true;

        this._eventBus.emit(new VisualTileSpawned(this.id));
    }

    public move(to: TilePosition): void {
        this.view.node.setPosition(this.getLocal(to));
        this.view.position = to;
        /* if (!this.busy) {
            this.startMove(to);
        } else {
            this.retargetMove(to);
        } */
    }

    public destroy(): void {
        this.busy = true;
        this._tweenHelper.build(TweenSettings.tileDestroy(this.view.node));
        /* this.view.node.setParent(this._fxLayer);
        this.currentTween = this._animationHelper.destroy(this.view.node);
        this.busy = false; */
        this.view.hide();
        
        this._eventBus.emit(new VisualTileDestroyed(this.id));
    }

    isBusy(): boolean {
        return this.busy;
    }

    // ===== PRIVATE =====

    private retargetMove(to: TilePosition): void {
        this.stopTween();
        //this.startMove(to);
    }

   /*  private startMove(to: TilePosition) {
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
      } */
  
      private stopTween() {
          if (this.currentTween) {
              this.currentTween.stop();
              this.currentTween = undefined;
          }
      }

    private playDestroyFx() {
        // fx / particles / shake / etc
    }

    private getLocal(position: TilePosition): cc.Vec2 {
        const originX = -((this._boardWidth - 1) * this._nodeWidth) / 2;
        const originY = ((this._boardHeight - 1) * this._nodeHeight) / 2;

        return cc.v2(originX + position.x * this._nodeWidth, originY - position.y * this._nodeHeight);
    }
}
