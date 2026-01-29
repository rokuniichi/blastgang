export class TilePosition {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static key(position: TilePosition, width: number): number {
        return position.x + position.y * width;
    };
}