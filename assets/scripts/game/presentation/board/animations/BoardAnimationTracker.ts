import { BoardKey } from "../../../application/board/BoardKey";
import { RuntimeBoardModel, TileLockReason } from "../../../application/board/runtime/RuntimeBoardModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { AnimationChain } from "../../common/animations/AnimationChain";
import { AnimationTask } from "../../common/animations/AnimationTask";

export class BoardAnimationTracker {
    private readonly _runtimeModel;
    private readonly _chains: Map<string, AnimationChain>;

    public constructor(runtimeModel: RuntimeBoardModel) {
        this._runtimeModel = runtimeModel;
        this._chains = new Map<string, AnimationChain>();
    }

    public enqueue(position: TilePosition, task: AnimationTask, reason: TileLockReason): void {
        const key = BoardKey.position(position);
        let chain = this._chains.get(key);
        if (!chain) {
            chain = new AnimationChain();
            this._chains.set(key, chain);
            chain.onResolve(async () => {
                this._runtimeModel.unlock(reason, position);
                this.tryCleanup(key);
            })
        }

        //this._runtimeModel.lock(reason, position);
        chain.add(task);
    }

    private tryCleanup(key: string) {
        const chain = this._chains.get(key);
        if (chain && !chain.busy) {
            this._chains.delete(key);
        }
    }
}