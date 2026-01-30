import { TileType } from "../../../domain/board/models/TileType";
import { AnimationSettings } from "../../core/animations/settings/AnimationSettings";
import { AnimationSystem } from "../../core/animations/AnimationSystem";
import { BoardAnimationTracker } from "./BoardAnimationTracker";
import { TileAssets } from "../../core/assets/TileAssets";
import { TileView } from "../view/TileView";
import { TileLockReason } from "../../../application/board/runtime/BoardRuntime";
import { AnimationTask } from "../../core/animations/AnimationTask";
import { TilePosition } from "../../../domain/board/models/TilePosition";

export class BoardAnimationHelper {

    private pool: cc.Node[] = [];
    constructor(
        private readonly _animationSystem: AnimationSystem,
        private readonly _animationTracker: BoardAnimationTracker,
        private readonly _backgroundLayer: cc.Node,
        private readonly _fxLayer: cc.Node,
        private readonly _tileAssets: TileAssets,
    ) { }

    private clone(source: TileView): TileView {
        let target = this.pool.pop();
        const node = source.node;

        if (!target || !cc.isValid(target)) {
            target = cc.instantiate(node);
        }

        target.setParent(this._fxLayer);
        target.active = true;

        target.setPosition(node.getPosition());
        target.scale = node.scale;
        target.opacity = node.opacity;

        const view = target.getComponent(TileView);
        view.set(source.get().clone());

        return view;
    }

    private release(node: cc.Node) {
        if (!cc.isValid(node)) return;

        cc.Tween.stopAllByTarget(node);
        node.active = false;
        node.removeFromParent(false);

        this.pool.push(node);
    }

    public destroy(tile: TileView): void {
        const fx = this.clone(tile);
        fx.node.setParent(this._backgroundLayer);

        const task = async () => {
            await this._animationSystem.play(AnimationSettings.tileDestroy(fx.node));
            this.release(fx.node)
        };

        this.track(tile.position, task, TileLockReason.DESTROY);
    }

    public drop(tile: TileView, to: cc.Vec3): void {
        const fx = this.clone(tile);
        fx.node.setParent(this._fxLayer);

        const task = async () => {
            await this._animationSystem.play(AnimationSettings.tileFall(fx.node, to.y));
            this.release(fx.node)
        };

        this.track(tile.position, task, TileLockReason.MOVE);
    }

    public spawn(tile: TileView, from: cc.Vec3, to: cc.Vec3, type: TileType): void {
        const fx = this.clone(tile);
        fx.set(this._tileAssets.get(type));

        fx.node.setPosition(from);

        const task = async () => {
            await this._animationSystem.play(AnimationSettings.tileFall(fx.node, to.y));
            this.release(fx.node)
        };

        this.track(tile.position, task, TileLockReason.SPAWN);
    }

    public shake(tile: TileView): void {
        const sequence = (node: cc.Node) => this._animationSystem.play(AnimationSettings.tileShake(node));
        this.play(sequence, tile, TileLockReason.SHAKE);
    }

    private play(sequence: (node: cc.Node) => Promise<void>, tile: TileView, reason: TileLockReason) {
        const task = async () => {
            tile.hide();
            const fx = this.clone(tile);
            await sequence(fx.node);
            this.release(fx.node);
            tile.show();
        }

        this.track(tile.position, task, reason);
    }

    private track(position: TilePosition, task: AnimationTask, reason: TileLockReason) {
        this._animationTracker.enqueue(position, task, reason);
    }
}