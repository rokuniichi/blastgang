import { EventBus } from "../../core/events/EventBus";
import { GameConfig } from "../config/game/GameConfig";
import { ApplicationGraph } from "../application/ApplicationGraph";
import { DomainGraph } from "../domain/DomainGraph";
import { PresentationGraph } from "../presentation/PresentationGraph";
import { VisualConfig } from "../config/visual/VisualConfig";

export class GameContext {
    public readonly eventBus: EventBus;
    public readonly domain: DomainGraph;
    public readonly application: ApplicationGraph;
    public readonly presentation: PresentationGraph;

    constructor(gameConfig: GameConfig, visualConfig: VisualConfig) {
        this.eventBus = new EventBus();

        this.domain = new DomainGraph(gameConfig);
        this.application = new ApplicationGraph(this.eventBus, this.domain);
        this.presentation = new PresentationGraph(this.eventBus, visualConfig, gameConfig, this.domain);
    }
}