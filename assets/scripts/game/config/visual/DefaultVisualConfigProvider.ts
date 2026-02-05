import { BaseConfigProvider } from "../../../core/config/providers/BaseConfigProvider";
import { BurstFxInfo, VisualConfig } from "./VisualConfig";

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
            shrinkScale: 0.9
        }

        this.config = {
            gravity: 8,
            dropDelayParameter: 0.015,
            initialSpawnLine: 8,
            normalSpawnLine: 7,
            nodeWidth: 100,
            nodeHeight: 112,
            burst
        };
    }
}