import { IDisposable } from "../../../../core/lifecycle/IDisposable";
import { assertNotNull } from "../../../../core/utils/assert";
import { Random } from "../../../../core/utils/random";
import { BurstFxInfo } from "../../../config/visual/VisualConfig";
import { TileType } from "../../../domain/board/models/TileType";
import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { TweenSettings } from "../../common/animations/TweenSettings";
import { ShardAssets } from "../../common/assets/ShardAssets";
import { NodePool } from "../../common/view/NodePool";
import { BurstMotion } from "./components/BurstMotion";

export class TileDestructionFx implements IDisposable {
    private readonly _burstInfo: BurstFxInfo;
    private readonly _tweenSystem: TweenSystem;
    private readonly _shards: ShardAssets;
    private readonly _parent: cc.Node;
    private readonly _shardPool: NodePool;

    public constructor(burstInfo: BurstFxInfo, tweenSystem: TweenSystem, shards: ShardAssets, parent: cc.Node, boardSize: number) {
        this._burstInfo = burstInfo;
        this._tweenSystem = tweenSystem;
        this._shards = shards;
        this._parent = parent;
        this._shardPool = new NodePool(shards.getPrefab(), parent, boardSize * burstInfo.maxCount);
    }

    public dispose(): void {
        this._shardPool.dispose();
    }

    public play(local: cc.Vec3, type: TileType): void {

        const count = Random.intRange(this._burstInfo.minCount, this._burstInfo.maxCount);

        for (let i = 0; i < count; i++) {
            const shard = this._shardPool.pull();
            const variant = this._shards.getSprite();
            const color = this._shards.getColor(type);

            const offset = cc.v3(
                Random.floatRange(-this._burstInfo.spawnRadius, this._burstInfo.spawnRadius),
                Random.floatRange(-this._burstInfo.spawnRadius, this._burstInfo.spawnRadius),
                0
            );

            shard.active = true
            shard.setParent(this._parent);
            shard.setPosition(local.clone().add(offset));

            const sprite = shard.getComponent(cc.Sprite);
            assertNotNull(sprite, this, "shard pool broken");
            sprite.spriteFrame = variant;

            shard.color = color;
            shard.scale = Random.floatRange(this._burstInfo.minScale, this._burstInfo.maxScale);

            const motion = shard.addComponent(BurstMotion);

            const angle = Random.floatRange(
                -this._burstInfo.horizontalSpread,
                this._burstInfo.horizontalSpread
            ) * Math.PI / 180;

            const speed = Random.floatRange(
                this._burstInfo.minUpVelocity,
                this._burstInfo.maxUpVelocity
            );

            motion.vx = Math.sin(angle) * speed;
            motion.vy = Math.cos(angle) * speed;

            motion.gravity = this._burstInfo.gravity;
            motion.drag = Random.floatRange(this._burstInfo.dragMin, this._burstInfo.dragMax);

            motion.av = Random.floatRange(
                this._burstInfo.minAngular,
                this._burstInfo.maxAngular
            );

            motion.duration = this._burstInfo.duration;
            motion.shrinkScale = this._burstInfo.shrinkScale;

            motion.play();

            this._tweenSystem.play(TweenSettings.burst(shard, this._burstInfo.duration))
                .call(() => this._shardPool.release(shard));
        }

    }
}