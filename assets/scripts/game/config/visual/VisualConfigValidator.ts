import { IConfigValidator } from "../../../core/config/IConfigValidator";
import { ensureNumber, ensureObject } from "../../../core/utils/ensure";
import { BurstFxInfo, DropFxInfo, SlingFxInfo, VisualConfig } from "./VisualConfig";

export class VisualConfigValidator implements IConfigValidator<VisualConfig> {
    validate(raw: any): VisualConfig {
        const data = ensureObject(raw, this, "data");

        const initialSpawnLine = ensureNumber(data.initialSpawnLine, this, "data.initialSpawnLine");
        const normalSpawnLine = ensureNumber(data.normalSpawnLine, this, "data.normalSpawnLine");
        const tileWidth = ensureNumber(data.tileWidth, this, "data.nodeWidth");
        const tileHeight = ensureNumber(data.tileHeight, this, "data.nodeHeight");
        const boardWidthPadding = ensureNumber(data.boardWidthPadding, this, "data.boardWidthPadding");
        const boardHeightPadding = ensureNumber(data.boardHeightPadding, this, "data.boardWidthPadding");

        const burstData = ensureObject(data.burst, this, "data.burstData");

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
        const fadeDelay = ensureNumber(burstData.fadeDelay, this, "burstData.fadeDelay");
        const shrinkScale = ensureNumber(burstData.shrinkScale, this, "burstData.shrinkScale");

        const dropData = ensureObject(data.drop, this, "data.dropData");

        const dropGravity = ensureNumber(dropData.gravity, this, "data.gravity");
        const delay = ensureNumber(dropData.delay, this, "dropData.delay");
        const bounce = ensureNumber(dropData.bounce, this, "dropData.bounce");
        const bounceDuration = ensureNumber(dropData.bounceDuration, this, "dropData.bounceDuration");
        const dropSettleDuration = ensureNumber(dropData.settleDuration, this, "dropData.settleDuration");

        const slingData = ensureObject(data.sling, this, "data.slingData");

        const pullDistance = ensureNumber(slingData.pullDistance, this, "slingData.pullDistance");
        const overshootDistance = ensureNumber(slingData.overshootDistance, this, "slingData.overshootDistance");
        const pullDuration = ensureNumber(slingData.pullDuration, this, "slingData.pullDuration");
        const launchSpeed = ensureNumber(slingData.launchSpeed, this, "slingData.launchSpeed");
        const minLaunchDuration = ensureNumber(slingData.minLaunchDuration, this, "slingData.minLaunchDuration");
        const maxLaunchDuration = ensureNumber(slingData.maxLaunchDuration, this, "slingData.maxLaunchDuration");
        const slingSettleDuration = ensureNumber(slingData.settleDuration, this, "slingData.settleDuration");

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
            fadeDelay,
            shrinkScale
        }

        const drop: DropFxInfo = {
            gravity: dropGravity,
            delay,
            bounce,
            bounceDuration,
            settleDuration: dropSettleDuration
        }

        const sling: SlingFxInfo = {
            pullDistance,
            overshootDistance,
            pullDuration,
            launchSpeed,
            minLaunchDuration,
            maxLaunchDuration,
            settleDuration: slingSettleDuration
        }

        return {
            initialSpawnLine,
            normalSpawnLine,
            tileWidth,
            tileHeight,
            boardWidthPadding,
            boardHeightPadding,
            burst,
            drop,
            sling
        };
    }
}
