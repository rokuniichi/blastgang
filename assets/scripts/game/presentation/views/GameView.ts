import { assertNotNull } from "../../../core/utils/assert";
import { GameStateChangedEvent } from "../../domain/state/events/GameStateChangedEvent";
import { GameStateModel } from "../../domain/state/models/GameStateModel";
import { GameViewContext } from "../context/GameViewContext";
import { EventView } from "./EventView";


const { ccclass, property } = cc._decorator;

@ccclass
export class GameView extends EventView<GameViewContext> {
    @property(cc.Label)
    private movesText: cc.Label = null!;
    @property(cc.Label)
    private scoreText: cc.Label = null!;
    @property(cc.Label)
    private teleportText: cc.Label = null!;
    @property(cc.Label)
    private bombText: cc.Label = null!;

    private gameStateModel!: GameStateModel;

    public override validate(): void {
        assertNotNull(this.movesText, this, "movesText");
        assertNotNull(this.scoreText, this, "scoreText");
        assertNotNull(this.teleportText, this, "teleportText");
        assertNotNull(this.bombText, this, "bombText");
    }

    protected override onInit(): void {
        this.gameStateModel = this.context.gameStateModel;
        this.updateText();
    }

    protected override subscribe(): void {
        this.on(GameStateChangedEvent, this.onGameStateChanged);
    }

    private onGameStateChanged = (event: GameStateChangedEvent): void => {
        this.updateText()
    }

    private updateText(): void {
        this.movesText.string = `${this.gameStateModel.movesLeft}`;
        this.scoreText.string = `${this.gameStateModel.currentScore}/${this.gameStateModel.targetScore}`;
        this.teleportText.string = "0";
        this.bombText.string = "0"
    }
}