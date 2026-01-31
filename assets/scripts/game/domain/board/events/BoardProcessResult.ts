import { TileCommit } from "../models/TileChange";
import { TileChanges } from "../models/TileChanges";

export class BoardProcessResult {
    public constructor(
        public readonly commits: TileCommit[],
        public readonly changes: TileChanges
    ) { }
}