import { TileCommit } from "../models/TileCommit";
import { TileMutations as TileMutations } from "../models/TileMutations";

export class BoardProcessResult {
    public constructor(
        public readonly commits: TileCommit[],
        public readonly mutations: TileMutations
    ) { }
}