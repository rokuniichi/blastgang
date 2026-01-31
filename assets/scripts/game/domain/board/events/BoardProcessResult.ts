import { TileChange } from "../models/TileChange";
import { VisualInstructions } from "../models/VisualInstructions";

export class BoardProcessResult {
    public constructor(
        public readonly changes: TileChange[],
        public readonly instructions: VisualInstructions
    ) { }
}