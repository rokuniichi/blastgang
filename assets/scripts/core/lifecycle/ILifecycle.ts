import { IDisposable } from "./IDisposable";
import { IInitializable } from "./IInitializable";

export interface ILifecycle<T = void> extends IInitializable<T>, IDisposable { }