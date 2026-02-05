import { IConfigValidator } from "../../../core/config/IConfigValidator";
import { ensureNumber, ensureObject } from "../../../core/utils/ensure";
import { BurstFxInfo, VisualConfig } from "./VisualConfig";

export class VisualConfigValidator implements IConfigValidator<VisualConfig> {
    validate(raw: any): VisualConfig {
        const data = ensureObject(raw, this, "data");
        const gravity = ensureNumber(data.gravity, this, "data.baseDropTime");
        const dropDelayParameter = ensureNumber(data.dropDelayParameter, this, "data.dropDelayParameter");
        const initialSpawnLine = ensureNumber(data.initialSpawnLine, this, "data.initialSpawnLine");
        const normalSpawnLine = ensureNumber(data.normalSpawnLine, this, "data.normalSpawnLine");
        const nodeWidth = ensureNumber(data.nodeWidth, this, "data.nodeWidth");
        const nodeHeight = ensureNumber(data.nodeHeight, this, "data.nodeHeight");

        const burstData = ensureObject(data.burst, this, "data.burst");
        const minCount = ensureNumber(burstData.minCount, this, "burstData.minCount");
        const maxCount = ensureNumber(burstData.maxCount, this, "burstData.maxCount");
        const minUpVelocity = ensureNumber(burstData.minUpVelocity, this, "burstData.minUpVelocity");
        const maxUpVelocity = ensureNumber(burstData.maxUpVelocity, this, "burstData.maxUpVelocity");
        const horizontalSpread = ensureNumber(burstData.horizontalSpread, this, "burstData.horizontalSpread");
        const spawnRadius = ensureNumber(burstData.spawnRadius, this, "burstData.spawnRadius");
        const minScale = ensureNumber(burstData.minScale, this, "burstData.minScale");
        const maxScale = ensureNumber(burstData.maxScale, this, "burstData.maxScale");
        const minAngular = ensureNumber(burstData.minAngular, this, "burstData.minAngular");
        const maxAngular = ensureNumber(burstData.maxAngular, this, "burstData.maxAngular");
        const burstGravity = ensureNumber(burstData.gravity, this, "burstData.burstGravity");
        const dragMin = ensureNumber(burstData.dragMin, this, "burstData.dragMin");
        const dragMax = ensureNumber(burstData.dragMax, this, "burstData.dragMax");
        const duration = ensureNumber(burstData.duration, this, "burstData.duration");
        const shrinkScale = ensureNumber(burstData.shrinkScale, this, "burstData.shrinkScale");

        const burst: BurstFxInfo = {
            minCount,
            maxCount,
            minUpVelocity,
            maxUpVelocity,
            horizontalSpread,
            spawnRadius,
            minScale,
            maxScale,
            minAngular,
            maxAngular,
            gravity: burstGravity,
            dragMin,
            dragMax,
            duration,
            shrinkScale
        }

        return {
            gravity,
            dropDelayParameter,
            initialSpawnLine,
            normalSpawnLine,
            nodeWidth,
            nodeHeight,
            burst
        };
    }
}
