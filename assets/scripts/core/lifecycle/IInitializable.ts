export interface IInitializable<T = void> {
    init(args: T): void;
}