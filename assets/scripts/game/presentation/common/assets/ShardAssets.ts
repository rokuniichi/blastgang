import { assertNotNull } from "../../../../core/utils/assert";
import { TileType } from "../../../domain/board/models/TileType";
import { ColorRecord } from "./ColorRecord";

const { ccclass, property } = cc._decorator;

@ccclass
export class ShardAssets extends cc.Component {

    @property([cc.Prefab])
    private shards: cc.Prefab[] = [];

    @property([ColorRecord])
    private colorRecords: ColorRecord[] = [];

    private colorMap = new Map<TileType, cc.Color>();

    protected onLoad(): void {
        for (const e of this.colorRecords) {
            this.colorMap.set(e.type, e.color);
        }
    }

    public createRandomShard(): cc.Node {
        const prefab = this.shards[
            Math.floor(Math.random() * this.shards.length)
        ];

        return cc.instantiate(prefab);
    }

    public getColor(type: TileType): cc.Color {
        const color = this.colorMap.get(type);
        assertNotNull(color, this, "color");
        return color;
    }
}