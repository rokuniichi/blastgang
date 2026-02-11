import { EventBus } from "../../core/eventbus/EventBus";
import { DomainGraph } from "../domain/DomainGraph";
import { BoardLogicController } from "./board/logic/controllers/BoardLogicController";
import { BoardInteractivityController } from "./board/runtime/controllers/BoardInteractivityController";
import { BoardInteractivityModel } from "./board/runtime/models/BoardInteractivityModel";
import { InputController } from "./input/controllers/InputController";
import { GameStateController } from "./state/controllers/GameStateController";

export class ApplicationGraph {
    public readonly inputController: InputController;
    public readonly interactivityModel: BoardInteractivityModel;
    public readonly interactivityController: BoardInteractivityController;
    public readonly logicController: BoardLogicController;
    public readonly stateController: GameStateController;

    constructor(eventBus: EventBus, domain: DomainGraph) {
        this.interactivityModel = new BoardInteractivityModel();
        this.inputController = new InputController(eventBus, domain, this.interactivityModel);
        this.interactivityController = new BoardInteractivityController(eventBus, domain, this.interactivityModel);
        this.logicController = new BoardLogicController(eventBus, domain, this.interactivityModel);
        this.stateController = new GameStateController(eventBus, domain);
    }
}