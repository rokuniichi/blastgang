import { TilePosition } from "../../domain/board/models/TilePosition";

export function getLocal(position: TilePosition, boardCols: number, boardRows: number, nodeWidth: number, nodeHeight: number): cc.Vec2 {
    const origin = getOrigin(boardCols, boardRows, nodeWidth, nodeHeight);
    return cc.v2(origin.x + position.x * nodeWidth, origin.y - position.y * nodeHeight);
}

export function getOrigin(boardCols: number, boardRows: number, nodeWidth: number, nodeHeight: number): cc.Vec2 {
    const originX = -((boardCols - 1) * nodeWidth) / 2;
    const originY = ((boardRows - 1) * nodeHeight) / 2;
    return cc.v2(originX, originY);
}

export function getSpeed(nodeHeight: number, gravity: number): number {
    return nodeHeight * gravity;
}

export function getLogical(
    local: cc.Vec2,
    boardCols: number,
    boardRows: number,
    nodeWidth: number,
    nodeHeight: number
): TilePosition {

    const origin = getOrigin(boardCols, boardRows, nodeWidth, nodeHeight);

    const x = Math.round((local.x - origin.x) / nodeWidth);
    const y = Math.round((origin.y - local.y) / nodeHeight);

    return { x, y };
}

export function outOfBounds(position: TilePosition, boardCols: number, boardRows: number): boolean {
    return (
        position.x < -1 ||
        position.y < -1 ||
        position.x > boardCols ||
        position.y > boardRows
    );
}

export function logicalEquals(a: TilePosition, b: TilePosition): boolean {
    return a.x === b.x && a.y === b.y;
}