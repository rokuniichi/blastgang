import { BaseConfigProvider } from "../../../../../core/config/BaseConfigProvider";
import { VisualConfig } from "./VisualConfig";

export class DefaultVisualConfigProvider extends BaseConfigProvider<VisualConfig> {
    async load(): Promise<void> {
        this.config = {
            baseDropTime: 0.28,
            perTileTime: 0.02
        };
    }
}