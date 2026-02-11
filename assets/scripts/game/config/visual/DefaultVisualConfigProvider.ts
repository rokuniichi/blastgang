import { BaseConfigProvider } from "../../../core/config/providers/BaseConfigProvider";
import { BurstFxInfo, DropFxInfo, RocketFxInfo, SlingFxInfo, VisualConfig } from "./VisualConfig";

export class DefaultVisualConfigProvider extends BaseConfigProvider<VisualConfig> {
    async load(): Promise<void> {
        const burst: BurstFxInfo = {
            minCount: 6,
            maxCount: 12,

            minUpVelocity: 750,
            maxUpVelocity: 1200,

            horizontalSpread: 350,

            spawnRadius: 120,

            minScale: 0.9,
            maxScale: 1.3,

            minAngular: -900,
            maxAngular: 900,

            gravity: 3000,

            dragMin: 0.94,
            dragMax: 0.985,

            duration: 0.9,
            fadeDelay: 0.7,
            shrinkScale: 0.9
        }

        const drop: DropFxInfo = {
            gravity: 3000,
            delay: 0.010,
            bounce: 10,
            bounceDuration: 0.08,
            settleDuration: 0.08
        }

        const sling: SlingFxInfo = {
            pullDistance: 18,
            overshootDistance: 6,
            pullDuration: 0.09,
            launchSpeed: 1600,
            minLaunchDuration: 0.12,
            maxLaunchDuration: 0.28,
            settleDuration: 0.07,
            disappearDistance: 25
        }

        const rocket: RocketFxInfo = {
            speed: 5
        }

        this.config = {
            initialSpawnLine: 8,
            normalSpawnLine: 7,
            tileWidth: 100,
            tileHeight: 112,
            boardWidthPadding: 42,
            boardHeightPadding: 58,
            burst,
            drop,
            sling,
            rocket
        };
    }
}