import { AnimationTask } from "./AnimationTask";

export class AnimationChain {

    private readonly _chain: AnimationTask[];

    private _running: boolean;
    private _onResolve?: AnimationTask;

    public constructor() {
        this._chain = [];
        this._running = false;
    }

    public busy(): boolean {
        return this._running;
    }

    public add(task: AnimationTask): void {
        this._chain.push(task);

        if (!this._running) {
            this._running = true;
            this.run();
        }
    }

    public onResolve(task: AnimationTask): void {
        this._onResolve = task;
    }

    private async run(): Promise<void> {
        while (!this.empty()) {
            const task = this._chain.shift()!;
            await task();
        }

        this._running = false;
        this._onResolve?.();
    }

    private empty(): boolean {
        return this._chain.length === 0;
    }
}