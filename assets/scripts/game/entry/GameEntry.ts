import { GameSession } from "../bootstrap/GameSession";
import { PresentationInstaller } from "../presentation/context/PresentationInstaller";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameEntry extends cc.Component {

    @property(PresentationInstaller)
    private presentationInstaller: PresentationInstaller = null!;

    private session!: GameSession;

    protected start(): void {
        this.session = new GameSession(this.presentationInstaller);
        this.session.start();
    }

    protected onDestroy(): void {
        this.session?.dispose();
    }
}