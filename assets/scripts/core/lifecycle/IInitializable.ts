export interface IInitializable<TArgs = void> {
    init(args: TArgs): void;
}