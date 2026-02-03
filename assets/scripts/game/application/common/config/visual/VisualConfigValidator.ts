import { IConfigValidator } from "../../../../../core/config/IConfigValidator";
import { assertObject } from "../../../../../core/utils/assert";
import { ensureNumber } from "../../../../../core/utils/ensure";
import { VisualConfig } from "./VisualConfig";


export class VisualConfigValidator implements IConfigValidator<VisualConfig> {
    validate(raw: any): VisualConfig {
        assertObject(raw, this, "raw");
        const baseDropTime = ensureNumber(raw.baseDropTime, this, "baseDropTime");
        const perTileTime = ensureNumber(raw.perTileTime, this, "baseDropTime");

        return {
            baseDropTime,
            perTileTime
        };
    }
}
