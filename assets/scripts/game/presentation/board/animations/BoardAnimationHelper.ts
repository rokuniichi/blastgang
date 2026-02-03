import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileType } from "../../../domain/board/models/TileType";
import { AnimationSystem } from "../../common/animations/AnimationSystem";
import { AnimationSettings } from "../../common/animations/settings/AnimationSettings";
import { TileView } from "../view/TileView";

export class AnimationHelper {


    public constructor(
        private readonly _animationSystem: AnimationSystem,
        private readonly _backgroundLayer: cc.Node,
        private readonly _fxLayer: cc.Node,
        private readonly _tilePrefab: cc.Prefab,
        private readonly _boardWidth: number,
        private readonly _boardHeight: number
    ) { }


    public destroy(target: cc.Node): Promise<void> {
        return this._animationSystem.play(AnimationSettings.tileDestroy(target));
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