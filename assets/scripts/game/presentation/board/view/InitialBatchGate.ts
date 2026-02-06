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
        console.log(`REGISTER started: ${this._started}, loaded: ${this._loaded}, ${this._initialBatch}`);
        if (this._started) return;
        if (this._initialBatch) return;
        this._initialBatch = batch;
        console.log(`DONE REGISTER started: ${this._started}, loaded: ${this._loaded}, ${this._initialBatch}`);
        this.tryStart();
    }

    private tryStart() {
        console.log(`tryStart started: ${this._started}, loaded: ${this._loaded}, ${this._initialBatch}`);
        if (this._started) return;
        if (!this._loaded) return;
        if (!this._initialBatch) return;

        this.start(this._initialBatch);
        this._started = true;

        this._initialBatch = null;
    }
}