import { TileType } from "../../../domain/board/models/TileType";
import { AnimationSettings } from "../../core/animations/AnimationSettings";
import { AnimationSystem } from "../../core/animations/AnimationSystem";
import { TileAssets } from "../../core/assets/TileAssets";
import { TileView } from "../view/TileView";

export class BoardFxLayer {

    private pool: cc.Node[] = [];
    constructor(
        private animationSystem: AnimationSystem,
        private backgroundLayer: cc.Node,
        private fxLayer: cc.Node,
        private tileAssets: TileAssets
    ) { }

    private clone(source: TileView): TileView {
        let target = this.pool.pop();
        const node = source.node;

        if (!target || !cc.isValid(target)) {
            target = cc.instantiate(node);
        }

        target.setParent(this.fxLayer);
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

    async destroy(tile: TileView): Promise<void> {
        const fx = this.clone(tile);
        fx.node.setParent(this.fxLayer);

        await this.animationSystem.play(
            AnimationSettings.tileDestroy(fx.node)
        );

        this.release(fx.node);
    }

    async drop(tile: TileView, to: cc.Vec3): Promise<void> {
        const fx = this.clone(tile);
        fx.node.setParent(this.backgroundLayer);

        await this.animationSystem.play(
            AnimationSettings.tileFall(fx.node, to.y)
        );

        this.release(fx.node);
    }

    async spawn(tile: TileView, from: cc.Vec3, to: cc.Vec3, type: TileType): Promise<void> {
        const fx = this.clone(tile);
        fx.set(this.tileAssets.get(type));

        fx.node.setPosition(from);

        await this.animationSystem.play(
            AnimationSettings.tileFall(fx.node, to.y)
        );

        this.release(fx.node);
    }
}