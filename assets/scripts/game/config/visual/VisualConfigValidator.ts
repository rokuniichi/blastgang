import { IConfigValidator } from "../../../core/config/IConfigValidator";
import { assertObject } from "../../../core/utils/assert";
import { ensureNumber } from "../../../core/utils/ensure";
import { VisualConfig } from "./VisualConfig";

export class VisualConfigValidator implements IConfigValidator<VisualConfig> {
    validate(raw: any): VisualConfig {
        assertObject(raw, this, "raw");
        const gravity = ensureNumber(raw.gravity, this, "baseDropTime");
        const dropDelayParameter = ensureNumber(raw.dropDelayParameter, this, "dropDelayParameter");
        const initialSpawnLine = ensureNumber(raw.initialSpawnLine, this, "initialSpawnLine");
        const normalSpawnLine = ensureNumber(raw.normalSpawnLine, this, "normalSpawnLine");
        const nodeWidth = ensureNumber(raw.nodeWidth, this, "nodeWidth");
        const nodeHeight = ensureNumber(raw.nodeHeight, this, "nodeHeight");

        return {
            gravity,
            dropDelayParameter,
            initialSpawnLine,
            normalSpawnLine,
            nodeWidth,
            nodeHeight
        };
    }
}
