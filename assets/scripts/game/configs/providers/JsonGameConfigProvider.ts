import { BaseGameConfigProvider } from "./BaseGameConfigProvider";
import { GameConfigValidator } from "../GameConfigValidator";

export class JsonGameConfigProvider extends BaseGameConfigProvider {
    private readonly _path;

    constructor(path: string) {
        super();
        this._path = path;
    }

    async load(): Promise<void> {
        const asset = await this.loadJsonAsset(this._path);
        this.config = GameConfigValidator.validate(asset.json);
    }

    private loadJsonAsset(path: string): Promise<cc.JsonAsset> {
        return new Promise((resolve, reject) => {
            cc.resources.load(path, cc.JsonAsset, (err, asset) => {
                if (err || !asset) {
                    reject(new Error(`[JsonGameConfigProvider] Failed to load: ${path}\n${err}`));
                } else {
                    resolve(asset as cc.JsonAsset);
                }
            });
        });
    }
}