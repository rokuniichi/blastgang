import { AnimationSystem } from "../../common/animations/AnimationSystem";
import { AnimationSettings } from "../../common/animations/settings/AnimationSettings";

export class AnimationHelper {


    public constructor(
        private readonly _animationSystem: AnimationSystem
    ) { }


    public async destroy(target: cc.Node): Promise<void> {
        await this._animationSystem.play(AnimationSettings.tileDestroy(target));
    }

   /*  public drop(type: TileType, from: TilePosition, to: TilePosition): Promise<void> {
        return this._animationSystem.play(AnimationSettings.tileFall(fx, destination.y));
    }

    public async spawn(type: TileType, at: TilePosition, offset: number): Promise<void> {
        await this._animationSystem.play(AnimationSettings.tileFall(fx, local.y - offset));
    }

    public async shake(type: TileType, at: TilePosition): Promise<void> {
        await this._animationSystem.play(AnimationSettings.tileShake(fx));
    } */
}