import { IConfigValidator } from "../../../../../core/config/IConfigValidator";
import { assertObject } from "../../../../../core/utils/assert";
import { ensureNumber } from "../../../../../core/utils/ensure";
import { VisualConfig } from "./VisualConfig";


export class VisualConfigValidator implements IConfigValidator<VisualConfig> {
    validate(raw: any): VisualConfig {
        assertObject(raw, this, "raw");
        const cellsPerSecond = ensureNumber(raw.cellsPerSecond, this, "baseDropTime");
        const spawnLineY = ensureNumber(raw.spawnLineY, this, "baseDropTime");

        return {
            cellsPerSecond,
            spawnLineY
        };
    }
}
