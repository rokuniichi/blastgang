import { DomainContext } from "../../domain/context/DomainContext";
import { PresentationContext } from "../../presentation/context/PresentationContext";
import { PresentationInstaller } from "../../presentation/context/PresentationInstaller";
import { GameConfigLoader } from "../common/config/game/GameConfigLoader";
import { VisualConfigLoader } from "../common/config/visual/VisualConfigLoader";
import { GameSettings } from "../common/settings/GameSettings";

export class GameStartup {

    private _domainContext!: DomainContext;
    private _presentationContext!: PresentationContext;

    public constructor(private readonly _presentationInstaller: PresentationInstaller) { }

    public async start(): Promise<void> {
        const configMode = GameSettings.CONFIG_MODE;
        const gameConfig = await new GameConfigLoader().load(configMode);
        const visualConfig = await new VisualConfigLoader().load(configMode);

        this._domainContext = new DomainContext(gameConfig);

        this._domainContext.gameStateController.init();
        this._domainContext.boardController.init();

        const initialBoard = this._domainContext.spawnService.spawn();
        initialBoard.forEach((_) => this._domainContext.runtimeModel.lockBoard());

        this._presentationContext = new PresentationContext(visualConfig, this._domainContext, initialBoard);
        this._presentationInstaller.init(this._presentationContext);
    }

    public dispose(): void {
        this._domainContext.boardController.dispose();
        this._domainContext.gameStateController.dispose();
        this._domainContext.eventBus.clear();
    }
}