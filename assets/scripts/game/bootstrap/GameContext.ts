import { EventBus } from "../../core/events/EventBus";
import { GameConfig } from "../config/game/GameConfig";
import { ApplicationGraph } from "../application/ApplicationGraph";
import { DomainGraph } from "../domain/DomainGraph";

export class GameContext {
    public readonly eventBus: EventBus;
    public readonly domain: DomainGraph;
    public readonly app: ApplicationGraph;

    constructor(gameConfig: GameConfig) {
        this.eventBus = new EventBus();

        this.domain = new DomainGraph(gameConfig);
        this.app = new ApplicationGraph(this.eventBus, this.domain);
    }
}