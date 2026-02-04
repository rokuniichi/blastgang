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