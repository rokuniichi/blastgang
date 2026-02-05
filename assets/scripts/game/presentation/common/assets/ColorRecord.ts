import { TileType } from "../../../domain/board/models/TileType";

const { ccclass, property } = cc._decorator;

@ccclass("ColorRecord")
export class ColorRecord {

    @property({ type: cc.Enum(TileType) })
    type: TileType = TileType.RED;

    @property(cc.Color)
    color: cc.Color = cc.Color.WHITE;
}