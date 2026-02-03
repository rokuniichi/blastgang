import { TilePosition } from "../../domain/board/models/TilePosition";
import { TileType } from "../../domain/board/models/TileType";

export class BoardKey {

    public static position(position: TilePosition): string {
        return `${position.x}:${position.y}`
    }

    public static type(type: TileType): string {
        return `${TileType[type]}`
    }
}