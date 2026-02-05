import { Random } from "../../../../core/utils/random";
import { BurstFxInfo } from "../../../config/visual/VisualConfig";
import { TileType } from "../../../domain/board/models/TileType";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { TweenSettings } from "../../common/animations/TweenSettings";
import { ShardAssets } from "../../common/assets/ShardAssets";
import { BurstMotion } from "./components/BurstMotion";

export class TileDestructionFx {

    constructor(
        private readonly _tweenHelper: TweenHelper,
        private readonly _fxLayer: cc.Node,
        private readonly _shards: ShardAssets,
        private readonly _gravity: number
    ) { }

    public play(local: cc.Vec3, type: TileType, info: BurstFxInfo): void {

        const count = Random.intRange(info.minCount, info.maxCount);

        for (let i = 0; i < count; i++) {
            const shard = this._shards.createRandomShard();
            const color = this._shards.getColor(type);
            shard.setParent(this._fxLayer);

            const offset = cc.v3(
                Random.floatRange(-info.spawnRadius, info.spawnRadius),
                Random.floatRange(-info.spawnRadius, info.spawnRadius),
                0
            );

            shard.setPosition(local.clone().add(offset));

            shard.color = color;

            shard.scale = Random.floatRange(info.minScale, info.maxScale);

            const motion = shard.addComponent(BurstMotion);

            const angle = Random.floatRange(
                -info.horizontalSpread,
                info.horizontalSpread
            ) * Math.PI / 180;

            const speed = Random.floatRange(
                info.minUpVelocity,
                info.maxUpVelocity
            );

            motion.vx = Math.sin(angle) * speed;
            motion.vy = Math.cos(angle) * speed;

            motion.gravity = info.gravity;
            motion.drag = Random.floatRange(info.dragMin, info.dragMax);

            motion.av = Random.floatRange(
                info.minAngular,
                info.maxAngular
            );

            motion.duration = info.duration;
            motion.shrinkScale = info.shrinkScale;

            motion.play();

            // TODO lifecycle control and pools
            this._tweenHelper
                .build(TweenSettings.burst(shard, info.duration))
                .start();
        }

    }
}