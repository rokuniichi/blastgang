import { IConfig } from "../../../core/config/IConfig";

export interface BurstFxInfo {
    minCount: number;
    maxCount: number;

    minUpVelocity: number;
    maxUpVelocity: number;

    horizontalSpread: number;

    spawnRadius: number;

    minScale: number;
    maxScale: number;

    minAngular: number;
    maxAngular: number;

    gravity: number;
    dragMin: number;
    dragMax: number;

    duration: number;
    shrinkScale: number;
}

export interface VisualConfig extends IConfig {
    readonly gravity: number;
    readonly dropDelayParameter: number;
    readonly initialSpawnLine: number;
    readonly normalSpawnLine: number;
    readonly nodeWidth: number;
    readonly nodeHeight: number;
    readonly burst: BurstFxInfo;
}