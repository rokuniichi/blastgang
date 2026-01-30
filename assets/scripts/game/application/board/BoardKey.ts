import { TilePosition } from "../../domain/board/models/TilePosition";

export class BoardKey {

    public static position(position: TilePosition): string {
        return `${position.x}:${position.y}`
    }

    public static column(x: number): string {
        return `col:${x}`
    }

    public static row(y: number): string {
        return `row:${y}`
    }

    public static board(): string {
        return "board";
    }
}