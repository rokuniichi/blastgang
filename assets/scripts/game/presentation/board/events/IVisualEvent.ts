import { TileId } from "../../../domain/board/models/BoardLogicalModel";

export interface IVisualEvent {
  readonly id: TileId;
}