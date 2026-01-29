import { ViewInstaller } from "../../presentation/installer/ViewInstaller";
import { GameConfigLoader } from "../config/GameConfigLoader";
import { DomainContext } from "../context/DomainContext";
import { PresentationContext } from "../context/PresentationContext";
import { GameSettings } from "../GameSettings";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameEntry extends cc.Component {

    @property(ViewInstaller)
    private viewInstaller: ViewInstaller = null!;

    private domainContext: DomainContext | null = null;
    private presentationContext: PresentationContext | null = null;

    protected async start(): Promise<void> {
        const configMode = GameSettings.configMode;

        const gameConfig = await new GameConfigLoader().load(configMode);

        this.domainContext = new DomainContext(gameConfig);
        this.domainContext.init();

        this.presentationContext = new PresentationContext(this.domainContext);
        this.viewInstaller.init(this.presentationContext);
    }

    protected onDestroy(): void {
        if (this.domainContext !== null) {
            this.domainContext.dispose();
            this.domainContext = null;
        }
    }
}