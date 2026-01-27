import { BoardModel } from "../models/BoardModel";
import { TileMove } from "../models/TileMove";
import { TilePosition } from "../models/TilePosition";
import { TileType } from "../models/TileType";

export class GravityService {

    public constructor() { }

    public apply(board: BoardModel, drops: TileMove[]): void{
        drops.forEach((move, _) => {
            board.swap(move.from, move.to);
            console.log(`Swapping ${board.get(move.from)} ${move.from.x}:${move.from.y} to ${board.get(move.from)} ${move.to.x}:${move.to.y}:`)
        })

    }
}