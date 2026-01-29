import { TilePosition } from "../../../domain/board/models/TilePosition";

export function getWorldPosition(position: TilePosition, node: cc.Node, boardWidth: number, boardHeight: number): cc.Vec2 {
        const width = node.width;
        const height = node.height;

        const originX = -((boardWidth - 1) * width) / 2;
        const originY = ((boardHeight - 1) * height) / 2;

        return cc.v2(
            originX + position.x * width,
            originY - position.y * height
        );
    }