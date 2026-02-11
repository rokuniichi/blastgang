import { EventBus } from "../../../../core/eventbus/EventBus";
import { IDisposable } from "../../../../core/lifecycle/IDisposable";
import { Random } from "../../../../core/utils/random";
import { BurstFxInfo } from "../../../config/visual/VisualConfig";
import { TileType } from "../../../domain/board/models/TileType";
import { ShardAssets } from "../../common/assets/ShardAssets";
import { NodePool } from "../../common/view/NodePool";
import { ShardFaded } from "../events/ShardFaded";
import { ShardView } from "./ShardView";

export class TileDestructionFxHolder implements IDisposable {
    private readonly _eventBus: EventBus;
    private readonly _burstInfo: BurstFxInfo;
    private readonly _shards: ShardAssets;
    private readonly _shardPool: NodePool;

    public constructor(eventBus: EventBus, burstInfo: BurstFxInfo, shards: ShardAssets, parent: cc.Node, boardSize: number) {
        this._eventBus = eventBus;
        this._burstInfo = burstInfo;
        this._shards = shards;
        this._shardPool = new NodePool(shards.getPrefab(), parent, boardSize * burstInfo.maxCount);

        this._eventBus.on(ShardFaded, this.onShardFaded);
    }

    public dispose(): void {
        this._shardPool.dispose();
        this._eventBus.off(ShardFaded, this.onShardFaded)
    }

    public play(local: cc.Vec3, type: TileType): void {
        const count = Random.intRange(this._burstInfo.minCount, this._burstInfo.maxCount);

        for (let i = 0; i < count; i++) {
            const node = this._shardPool.pull();
            const shard = node.getComponent(ShardView);
            shard.init(this._shards);

            const offset = cc.v3(
                Random.floatRange(-this._burstInfo.spawnRadius, this._burstInfo.spawnRadius),
                Random.floatRange(-this._burstInfo.spawnRadius, this._burstInfo.spawnRadius),
                0
            );

            shard.set(type);
            shard.show();
            shard.node.setPosition(local.clone().add(offset));
            shard.node.scale = Random.floatRange(this._burstInfo.minScale, this._burstInfo.maxScale);

            const angle = Random.floatRange(
                -this._burstInfo.horizontalSpread,
                this._burstInfo.horizontalSpread
            ) * Math.PI / 180;

            const speed = Random.floatRange(
                this._burstInfo.minUpVelocity,
                this._burstInfo.maxUpVelocity
            );

            const vx = Math.sin(angle) * speed;
            const vy = Math.cos(angle) * speed;

            const gravity = this._burstInfo.gravity;
            const drag = Random.floatRange(this._burstInfo.dragMin, this._burstInfo.dragMax);

            const av = Random.floatRange(this._burstInfo.minAngular, this._burstInfo.maxAngular);

            const duration = this._burstInfo.duration;
            const fadeDelay = this._burstInfo.fadeDelay;
            const shrinkScale = this._burstInfo.shrinkScale;

            shard.burst.play(this._eventBus, vx, vy, gravity, drag, av, duration, fadeDelay, shrinkScale);
        }
    }

    private onShardFaded = (event: ShardFaded) => {
        this._shardPool.release(event.node);
    };
}