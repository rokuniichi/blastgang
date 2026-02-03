import { AnimationTask } from "./AnimationTask";

export class AnimationChain {
    private readonly _chain: AnimationTask[];
    private _running: boolean;
    private _onResolve: AnimationTask[];
    private _runPromise: Promise<void> | null;

    public constructor() {
        this._chain = [];
        this._running = false;
        this._onResolve = [];
        this._runPromise = null;
    }

    public get busy(): boolean {  // ← ГЕТТЕР!
        return this._running || this._chain.length > 0;
    }

    public add(task: AnimationTask): void {
        this._chain.push(task);

        // Автоматический запуск если еще не запущена
        if (!this._running) {
            this.run();
        }
    }

    public onResolve(task: AnimationTask): void {
        this._onResolve.push(task);
    }

    public async run(): Promise<void> {
        if (this._running) {
            // Если уже запущена - ждем ее завершения
            return this._runPromise || Promise.resolve();
        }

        this._running = true;
        this._runPromise = this.execute();
        await this._runPromise;
        this._runPromise = null;
    }

    private async execute(): Promise<void> {
        while (this._chain.length > 0) {
            const task = this._chain.shift()!;
            try {
                await task();
            } catch (error) {
                console.error('AnimationChain task error:', error);
            }
        }

        this._running = false;

        // Вызываем onResolve ASYNC!
        const resolvers = [...this._onResolve];
        this._onResolve = [];
        
        for (const task of resolvers) {
            try {
                await task();
            } catch (error) {
                console.error('AnimationChain onResolve error:', error);
            }
        }
    }
}