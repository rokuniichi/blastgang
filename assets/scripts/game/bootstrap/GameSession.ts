import { ILifecycle } from "../../core/lifecycle/ILifecycle";
import { GameConfigLoader } from "../config/game/GameConfigLoader";
import { VisualConfigLoader } from "../config/visual/VisualConfigLoader";
import { GameRestartRequset } from "../presentation/board/events/GameRestartRequest";
import { PresentationInstaller } from "../presentation/PresentationInstaller";
import { GameSettings } from "../settings/GameSettings";
import { GameContext } from "./GameContext";

export class GameSession {
    private _gameContext?: GameContext | null;

    private _lifecycle: ILifecycle[] = [];

    constructor(private readonly _presentationInstaller: PresentationInstaller) { }

    public async start(): Promise<void> {
        const configMode = GameSettings.CONFIG_MODE;
        const gameConfig = await new GameConfigLoader().load(configMode);
        const visualConfig = await new VisualConfigLoader().load(configMode);

        this._gameContext = new GameContext(gameConfig, visualConfig);

        this._presentationInstaller.prepare(this._gameContext.presentation);

        this._lifecycle = [
            this._presentationInstaller,
            this._gameContext.application.stateController,
            this._gameContext.application.logicController,
            this._gameContext.application.runtimeController
        ];

        this._gameContext.eventBus.on(GameRestartRequset, this.restart);

        this.init();
    }

    private init(): void {
        this._lifecycle.forEach((entity) => entity.init());
    }

    public dispose(): void {
        this._gameContext?.eventBus.clear();
        this._gameContext = null;
        this._lifecycle.forEach((entity) => entity.dispose());
        this._lifecycle = [];
    }

    private restart = () => {
        this.dispose();
        this.start();
    }
}