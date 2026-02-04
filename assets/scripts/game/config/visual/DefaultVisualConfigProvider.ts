import { BaseConfigProvider } from "../../../core/config/providers/BaseConfigProvider";
import { VisualConfig } from "./VisualConfig";

export class DefaultVisualConfigProvider extends BaseConfigProvider<VisualConfig> {
    async load(): Promise<void> {
        this.config = {
            gravity: 8,
            dropDelayParameter: 0.015,
            initialSpawnLine: 8,
            normalSpawnLine: 7,
            nodeWidth: 100,
            nodeHeight: 112
        };
    }
}