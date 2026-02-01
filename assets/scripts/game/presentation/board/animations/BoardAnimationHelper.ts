import { TileLockReason } from "../../../application/board/runtime/BoardRuntimeModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileType } from "../../../domain/board/models/TileType";
import { AnimationSystem } from "../../common/animations/AnimationSystem";
import { AnimationTask } from "../../common/animations/AnimationTask";
import { AnimationSettings } from "../../common/animations/settings/AnimationSettings";
import { TileView } from "../view/TileView";
import { BoardAnimationTracker } from "./BoardAnimationTracker";

export class BoardAnimationHelper {

    private pool: cc.Node[] = [];

    public constructor(
        private readonly _animationSystem: AnimationSystem,
        private readonly _animationTracker: BoardAnimationTracker,
        private readonly _backgroundLayer: cc.Node,
        private readonly _fxLayer: cc.Node,
        private readonly _tilePrefab: cc.Prefab,
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
        const position = this.getLocalPosition(at, tile.node.width, tile.node.height);
        const sequence = async (target: cc.Node) => {
            this.prepare(
                target,
                tile.get(),
                position,
                this._backgroundLayer
            );
            await this._animationSystem.play(AnimationSettings.tileDestroy(target));
        };

        this.play(sequence, tile, TileLockReason.DESTROY);
    }


    // TODO resolve from, to, at conflicts
    public drop(to: TileView, from: TileView): void {
        const position = this.getLocalPosition(from.position, from.node.width, from.node.height);
        const sequence = async (target: cc.Node) => {
            this.prepare(
                target,
                from.get(),
                position,
                this._fxLayer
            );
            const toY = this.getLocalPosition(to.position, target.width, target.height).y;
            await this._animationSystem.play(AnimationSettings.tileFall(target, toY));
        }
        this.play(sequence, from, TileLockReason.MOVE);
    }

    public spawn(to: TileView, from: TileView, type: TileType): void {
        const localTarget = this.getLocalPosition(to.position, to.node.width, to.node.height);
        const localSource = this.getLocalPosition(from.position, from.node.width, from.node.height)
        const sequence = async (target: cc.Node) => {
            this.prepare(target, type, localSource, this._fxLayer)
            await this._animationSystem.play(AnimationSettings.tileFall(target, localTarget.y));
        };

        this.play(sequence, from, TileLockReason.SPAWN);
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

        this.play(sequence, tile, TileLockReason.SHAKE);
    }

    public getLocalPosition(position: TilePosition, nodeWidth: number, nodeHeight: number): cc.Vec2 {
        const originX = -((this._boardWidth - 1) * nodeWidth) / 2;
        const originY = ((this._boardHeight - 1) * nodeHeight) / 2;

        return cc.v2(originX + position.x * nodeWidth, originY - position.y * nodeHeight);
    }

    private play(sequence: (target: cc.Node) => Promise<void>, tile: TileView, reason: TileLockReason) {
        const task = async () => {
            const fx = this.create();
            await sequence(fx);
            this.release(fx);
        }

        this.track(tile, task, reason);
    }

    private track(tile: TileView, task: AnimationTask, reason: TileLockReason) {
        this._animationTracker.enqueue(tile, task, reason);
    }

    private prepare(target: cc.Node, type: TileType, position: cc.Vec2, parent: cc.Node) {
        target.active = true;
        target.getComponent(TileView).set(type);
        target.setPosition(position);
        target.setParent(parent);
    }
}