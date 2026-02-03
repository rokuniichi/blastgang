import { BaseConfigProvider } from "../../../../../core/config/BaseConfigProvider";
import { VisualConfig } from "./VisualConfig";

export class DefaultVisualConfigProvider extends BaseConfigProvider<VisualConfig> {
    async load(): Promise<void> {
        this.config = {
            cellsPerSecond: 9,
            spawnLineY: 900
        };
    }
}