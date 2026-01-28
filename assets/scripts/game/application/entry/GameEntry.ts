import { ViewInstaller } from "../../presentation/installer/ViewInstaller";
import { GameConfigLoader } from "../config/GameConfigLoader";
import { GameContext } from "../context/GameContext";
import { GameSettings } from "../GameSettings";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameEntry extends cc.Component {

    @property(ViewInstaller)
    private viewInstaller: ViewInstaller = null!;

    private gameContext: GameContext | null = null;

    protected async start(): Promise<void> {
        const configMode = GameSettings.configMode;

        const gameConfig = await new GameConfigLoader().load(configMode);

        this.gameContext = new GameContext(gameConfig);
        this.gameContext.init();

        this.viewInstaller.init({
            eventBus: this.gameContext.eventBus,
            gameStateModel: this.gameContext.gameStateModel,
            boardModel: this.gameContext.boardModel
        });
    }

    protected onDestroy(): void {
        if (this.gameContext !== null) {
            this.gameContext.dispose();
            this.gameContext = null;
        }
    }
}