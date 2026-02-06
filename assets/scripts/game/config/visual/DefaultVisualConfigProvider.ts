import { BaseConfigProvider } from "../../../core/config/providers/BaseConfigProvider";
import { BurstFxInfo, DropFxInfo, VisualConfig } from "./VisualConfig";

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
            delay: 0.10,
            bounce: 10,
            bounceDuration: 0.08,
            settleDuration: 0.08
        }

        this.config = {
            gravity: 8,
            initialSpawnLine: 8,
            normalSpawnLine: 7,
            tileWidth: 100,
            tileHeight: 112,
            boardWidthPadding: 42,
            boardHeightPadding: 58,
            burst,
            drop
        };
    }
}