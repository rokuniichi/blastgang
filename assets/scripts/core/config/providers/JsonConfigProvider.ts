import { BaseConfigProvider } from "../BaseConfigProvider";
import { IConfig } from "../IConfig";
import { IConfigValidator } from "../IConfigValidator";

export class JsonConfigProvider<TConfig extends IConfig> extends BaseConfigProvider<TConfig> {
    public constructor(
        private readonly _path: string, 
        private readonly _validator: IConfigValidator<TConfig>) {
        super();
    }

    public async load(): Promise<void> {
        const asset = await this.loadJsonAsset(this._path);
        this.config = this._validator.validate(asset.json);
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