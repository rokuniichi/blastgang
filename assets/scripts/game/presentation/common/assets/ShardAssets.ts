import { assertNotNull } from "../../../../core/utils/assert";
import { Random } from "../../../../core/utils/random";
import { TileType } from "../../../domain/board/models/TileType";
import { ColorRecord } from "./ColorRecord";

const { ccclass, property } = cc._decorator;

@ccclass
export class ShardAssets extends cc.Component {

    @property(cc.Prefab)
    private prefab: cc.Prefab = null!;

    @property([cc.SpriteFrame])
    private sprites: cc.SpriteFrame[] = [];

    @property([ColorRecord])
    private colorRecords: ColorRecord[] = [];

    private colorMap = new Map<TileType, cc.Color>();

    protected onLoad(): void {
        for (const e of this.colorRecords) {
            this.colorMap.set(e.type, e.color);
        }
    }

    public getPrefab(): cc.Prefab {
        return this.prefab;
    }

    public getSprite(): cc.SpriteFrame {
        return this.sprites[Random.intRange(0, this.sprites.length)];
    }

    public getColor(type: TileType): cc.Color {
        const color = this.colorMap.get(type);
        assertNotNull(color, this, "color");
        return color;
    }
}