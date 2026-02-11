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
    fadeDelay: number;
    shrinkScale: number;
}

export interface DropFxInfo {
    gravity: number;
    delay: number;
    bounce: number;
    bounceDuration: number;
    settleDuration: number;
}

export interface SlingFxInfo {
    pullDistance: number;
    overshootDistance: number;
    pullDuration: number;
    launchSpeed: number;
    minLaunchDuration: number;
    maxLaunchDuration: number;
    settleDuration: number;
    disappearDistance: number;
}

export interface RocketFxInfo {
    speed: number;
}

export interface VisualConfig extends IConfig {
    readonly initialSpawnLine: number;
    readonly normalSpawnLine: number;
    readonly tileWidth: number;
    readonly tileHeight: number;
    readonly boardWidthPadding: number;
    readonly boardHeightPadding: number;
    readonly burst: BurstFxInfo;
    readonly drop: DropFxInfo;
    readonly sling: SlingFxInfo;
    readonly rocket: RocketFxInfo;
}