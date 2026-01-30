import { DomainContext } from "../../domain/context/DomainContext";
import { PresentationContext } from "../../presentation/context/PresentationContext";
import { PresentationInstaller } from "../../presentation/context/PresentationInstaller";
import { GameConfigLoader } from "../core/config/GameConfigLoader";
import { GameSettings } from "../settings/GameSettings";


const { ccclass, property } = cc._decorator;

@ccclass
export class GameEntry extends cc.Component {

    @property(PresentationInstaller)
    private presentationInstaller: PresentationInstaller = null!;

    private domainContext: DomainContext | null = null;
    private presentationContext: PresentationContext | null = null;

    protected async start(): Promise<void> {
        const configMode = GameSettings.configMode;

        const gameConfig = await new GameConfigLoader().load(configMode);

        this.domainContext = new DomainContext(gameConfig);
        this.domainContext.init();
        this.presentationContext = new PresentationContext(this.domainContext);
        
        this.presentationInstaller.init(this.presentationContext);
    }

    protected onDestroy(): void {
        if (this.domainContext !== null) {
            this.domainContext.dispose();
            this.domainContext = null;
        }
    }
}