import { TileState } from "./TileState";
import { TileType } from "./TileType";

export class TileModel {
    public type: TileType;
    public state: TileState;

    constructor(type: TileType, state: TileState) {
        this.type = type;
        this.state = state;
    };

    public clone(): TileModel {
        return new TileModel(this.type, this.state);
    }
}