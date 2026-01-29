import { TileSpawn } from "../../../domain/board/models/TileSpawn";
import { AnimationSystem } from "../../animations/AnimationSystem";
import { EventViewContext } from "../../core/context/EventViewContext";

export interface BoardViewContext extends EventViewContext {
    readonly animationSystem: AnimationSystem;
    readonly boardWidth: number;
    readonly boardHeight: number;
    readonly initialBoard: TileSpawn[];
}