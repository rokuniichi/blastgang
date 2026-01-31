import { TileType } from "../../../domain/board/models/TileType";
import { AnimationSettings } from "../../common/animations/settings/AnimationSettings";
import { AnimationSystem } from "../../common/animations/AnimationSystem";
import { BoardAnimationTracker } from "./BoardAnimationTracker";
import { TileAssets } from "../../common/assets/TileAssets";
import { TileView } from "../view/TileView";
import { TileLockReason } from "../../../application/board/runtime/RuntimeBoardModel";
import { AnimationTask } from "../../common/animations/AnimationTask";
import { TilePosition } from "../../../domain/board/models/TilePosition";

export class BoardAnimationHelper {

    private pool: cc.Node[] = [];

    public constructor(
        private readonly _animationSystem: AnimationSystem,
        private readonly _animationTracker: BoardAnimationTracker,
        private readonly _backgroundLayer: cc.Node,
        private readonly _fxLayer: cc.Node,
        private readonly _tilePrefab: cc.Prefab,
        private readonly _tileAssets: TileAssets,
        private readonly _boardWidth: number,
        private readonly _boardHeight: number
    ) { }

    private create(): cc.Node {
        let node = this.pool.pop();
        if (!node || !cc.isValid(node)) {
            node = cc.instantiate(this._tilePrefab);
        }
        node.setParent(this._fxLayer);
        return node;
    }

    private release(node: cc.Node) {
        if (!cc.isValid(node)) return;

        cc.Tween.stopAllByTarget(node);
        node.active = false;
        node.removeFromParent(false);

        this.pool.push(node);
    }

    public destroy(tile: TileView, at: TilePosition): void {
        const sprite = tile.get();
        const position = this.getLocalPosition(at, tile.node.width, tile.node.height);
        const sequence = async (target: cc.Node) => {
            this.prepare(
                target,
                sprite,
                position,
                this._backgroundLayer
            );
            await this._animationSystem.play(AnimationSettings.tileDestroy(target));
        };

        this.play(sequence, tile, at, TileLockReason.DESTROY);
    }

    public drop(tile: TileView, to: TilePosition): void {
        const sprite = tile.get();
        const position = this.getLocalPosition(tile.position, tile.node.width, tile.node.height);
        const sequence = async (target: cc.Node) => {
            this.prepare(
                target,
                sprite,
                position,
                this._fxLayer
            );
            const toY = this.getLocalPosition(to, target.width, target.height).y;
            await this._animationSystem.play(AnimationSettings.tileFall(target, toY));
        }
        this.play(sequence, tile, to, TileLockReason.MOVE);
    }

    public spawn(tile: TileView, at: TilePosition, type: TileType): void {
        const to = this.getLocalPosition(at, tile.node.width, tile.node.height);
        const from = to.clone();
        from.y += tile.node.height * 2;
        const sequence = async (target: cc.Node) => {
            this.prepare(target, this._tileAssets.get(type), from, this._fxLayer)
            await this._animationSystem.play(AnimationSettings.tileFall(target, to.y));
        };

        this.play(sequence, tile, at, TileLockReason.SPAWN);
    }

    public shake(tile: TileView): void {
        const sequence = async (target: cc.Node) => {
            this.prepare(
                target,
                tile.get(),
                this.getLocalPosition(tile.position, tile.node.width, tile.node.height),
                this._backgroundLayer
            );
            await this._animationSystem.play(AnimationSettings.tileShake(target))
        };

        this.play(sequence, tile, tile.position, TileLockReason.SHAKE);
    }

    public getLocalPosition(position: TilePosition, nodeWidth: number, nodeHeight: number): cc.Vec2 {
        const originX = -((this._boardWidth - 1) * nodeWidth) / 2;
        const originY = ((this._boardHeight - 1) * nodeHeight) / 2;

        return cc.v2(originX + position.x * nodeWidth, originY - position.y * nodeHeight);
    }

    private play(sequence: (target: cc.Node) => Promise<void>, tile: TileView, position: TilePosition, reason: TileLockReason) {
        const task = async () => {
            // MEMO закрадывается буга с не тем tile
            tile.hide();
            const fx = this.create();
            await sequence(fx);
            this.release(fx);
            tile.show();
        }
        this.track(position, task, reason);
    }

    private track(position: TilePosition, task: AnimationTask, reason: TileLockReason) {
        this._animationTracker.enqueue(position, task, reason);
    }

    private prepare(target: cc.Node, sprite: cc.SpriteFrame, position: cc.Vec2, parent: cc.Node) {
        target.active = true;
        target.getComponent(TileView).set(sprite);
        target.setPosition(position);
        target.setParent(parent);
    }
}