export abstract class BasePool<T> {
    protected _pool: T[] = [];

    public abstract pull(...args: any): T;
    public abstract release(...args: any): void;
}