import { DomainContext } from "../../domain/context/DomainContext";
import { PresentationContext } from "../../presentation/context/PresentationContext";
import { PresentationInstaller } from "../../presentation/context/PresentationInstaller";
import { GameConfigLoader } from "../common/config/GameConfigLoader";
import { GameSettings } from "../common/settings/GameSettings";

export class GameStartup {

    private _domainContext!: DomainContext;
    private _presentationContext!: PresentationContext;

    public constructor(
        private readonly presentationInstaller: PresentationInstaller
    ) { }

    public async start(): Promise<void> {
        const configMode = GameSettings.configMode;
        const config = await new GameConfigLoader().load(configMode);

        this._domainContext = new DomainContext(config);

        const initialBoard = this._domainContext.spawnService.spawn();

        this._domainContext.gameStateController.init();
        this._domainContext.boardController.init();

        this._presentationContext = new PresentationContext(this._domainContext, initialBoard);

        this.presentationInstaller.init(this._presentationContext);
    }

    public dispose(): void {
        this._domainContext.boardController.dispose();
        this._domainContext.gameStateController.dispose();
        this._domainContext.eventBus.clear();
    }
}