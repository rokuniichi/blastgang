import { GameStartup } from "../bootstrap/GameStartup";
import { PresentationInstaller } from "../presentation/context/PresentationInstaller";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameEntry extends cc.Component {

    @property(PresentationInstaller)
    private presentationInstaller: PresentationInstaller = null!;

    private startup!: GameStartup;

    protected start(): void {
        this.startup = new GameStartup(this.presentationInstaller);
        this.startup.start();
    }

    protected onDestroy(): void {
        this.startup?.dispose();
    }
}