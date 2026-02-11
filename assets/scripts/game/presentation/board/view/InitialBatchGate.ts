import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";

export class InitialBatchGate {

    private _started = false;
    private _loaded = false;
    private _initialBatch: BoardMutationsBatch | null = null;

    constructor(private readonly start: (batch: BoardMutationsBatch) => void) { }

    public get started() { return this._started; }

    public proceed() {
        this._loaded = true;
        this.tryStart();
    }

    public register(batch: BoardMutationsBatch) {
        if (this._started) return;
        if (this._initialBatch) return;
        this._initialBatch = batch;
        this.tryStart();
    }

    private tryStart() {
        if (this._started) return;
        if (!this._loaded) return;
        if (!this._initialBatch) return;

        this.start(this._initialBatch);
        this._started = true;

        this._initialBatch = null;
    }
}