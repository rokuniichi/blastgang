import { IConfig } from "../../../core/config/IConfig";

export interface VisualConfig extends IConfig {
    readonly gravity: number;
    readonly dropDelayParameter: number;
    readonly initialSpawnLine: number;
    readonly normalSpawnLine: number;
    readonly nodeWidth: number;
    readonly nodeHeight: number;
}