import { BoardRuntimeModel, TileLockReason } from "../../../application/board/runtime/BoardRuntimeModel";
import { AnimationChain } from "../../common/animations/AnimationChain";
import { AnimationTask } from "../../common/animations/AnimationTask";
import { TileView } from "../view/TileView";

export class BoardAnimationTracker {
    private readonly _runtimeModel;
    private readonly _chains: Map<string, AnimationChain>;
    
    private _onCleanup?: () => void;

    public constructor(runtimeModel: BoardRuntimeModel) {
        this._runtimeModel = runtimeModel;
        this._chains = new Map<string, AnimationChain>();
    }

    public enqueue(tileView: TileView, task: AnimationTask, reason: TileLockReason): void {
        const chain = this.get(tileView.uuid);
        chain.add(task);
        chain.add(async () => this._runtimeModel.unlock(reason, tileView.position));
    }

    public enclose(tileView: TileView, task: AnimationTask): void {
        const chain = this.get(tileView.uuid);
        chain.onResolve(task);
    }

    public onCleanup(callback: () => void) {
        this._onCleanup = callback;
    }

    private get(uuid: string): AnimationChain {
        const key = uuid;
        let chain = this._chains.get(key);
        if (!chain) {
            chain = new AnimationChain();
            this._chains.set(key, chain);
            chain.onResolve(async () => this.cleanup(key));
        }
        return chain;
    }

    private cleanup(key: string) {
        const chain = this._chains.get(key);
        if (chain && !chain.busy) {
            this._chains.delete(key);
            this._onCleanup?.();
        }
    }
}
