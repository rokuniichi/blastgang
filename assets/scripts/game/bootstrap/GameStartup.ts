import { GameConfigLoader } from "../config/game/GameConfigLoader";
import { VisualConfigLoader } from "../config/visual/VisualConfigLoader";
import { PresentationContext } from "../presentation/context/PresentationContext";
import { PresentationInstaller } from "../presentation/context/PresentationInstaller";
import { GameSettings } from "../settings/GameSettings";
import { GameContext } from "./GameContext";

export class GameStartup {
    private _gameContext!: GameContext;

    constructor(private readonly presentationInstaller: PresentationInstaller) { }

    async start(): Promise<void> {
        const configMode = GameSettings.CONFIG_MODE;
        const gameConfig = await new GameConfigLoader().load(configMode);
        const visualConfig = await new VisualConfigLoader().load(configMode);

        this._gameContext = new GameContext(gameConfig);

        this._gameContext.app.stateController.init();
        this._gameContext.app.logicController.init();
        this._gameContext.app.runtimeController.init();

        // move to separate service
        const initialBoard = this._gameContext.domain.spawnService.spawn();
        initialBoard.forEach((tile) => this._gameContext.app.runtimeModel.addBlocker(tile.id));

        const presentationContext = new PresentationContext(
            visualConfig,
            gameConfig,
            this._gameContext.eventBus,
            this._gameContext.domain.gameStateModel,
            initialBoard
        );

        this.presentationInstaller.init(presentationContext);
    }

    dispose(): void {
        this._gameContext.app.logicController.dispose();
        this._gameContext.app.stateController.dispose();
        this._gameContext.eventBus.clear();
    }
}