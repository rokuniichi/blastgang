import { AnimationSettings } from "../../core/animations/AnimationSettings";
import { AnimationSystem } from "../../core/animations/AnimationSystem";
import { TileAssets } from "../../core/assets/TileAssets";
import { FxPool } from "./TileFxPool";


export class BoardFxLayer {

    private readonly pool: FxPool;

    constructor(
        fxRoot: cc.Node,
        tilePrefab: cc.Prefab,
        private tileAssets: TileAssets,
        private animationSystem: AnimationSystem
    ) {
        this.pool = new FxPool(tilePrefab, fxRoot);
    }

    private createFxTile(type: any, worldPos: cc.Vec3): cc.Node {
        const node = this.pool.get();

        node.setPosition(worldPos);

        const sprite = node.getComponent(cc.Sprite)!;
        sprite.spriteFrame = this.tileAssets.get(type);

        node.scale = 1;
        node.opacity = 255;

        return node;
    }

    async playDestroy(type: any, worldPos: cc.Vec3): Promise<void> {
        const node = this.createFxTile(type, worldPos);

        await this.animationSystem.play(AnimationSettings.tileDestroy(node));

        this.pool.release(node);
    }

    async playDrop(type: any, from: cc.Vec3, to: cc.Vec3): Promise<void> {
        const node = this.createFxTile(type, from);

        await this.animationSystem.play(AnimationSettings.tileFall(node, to.y));

        this.pool.release(node);
    }

    async playSpawn(type: any, from: cc.Vec3, to: cc.Vec3): Promise<void> {
        const node = this.createFxTile(type, from);

        await this.animationSystem.play(AnimationSettings.tileFall(node, to.y));

        this.pool.release(node);
    }
}