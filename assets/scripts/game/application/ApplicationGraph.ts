import { EventBus } from "../../core/eventbus/EventBus";
import { BoardLogicController } from "./board/controllers/BoardLogicController";
import { BoardRuntimeController } from "./board/controllers/BoardRuntimeController";
import { BoardRuntimeModel } from "./board/models/BoardRuntimeModel";
import { GameStateController } from "./state/controllers/GameStateController";
import { DomainGraph } from "../domain/DomainGraph";
import { InputController } from "./input/controllers/InputController";

export class ApplicationGraph {
    public readonly inputController: InputController;
    public readonly runtimeModel: BoardRuntimeModel;
    public readonly runtimeController: BoardRuntimeController;
    public readonly logicController: BoardLogicController;
    public readonly stateController: GameStateController;

    constructor(eventBus: EventBus, domain: DomainGraph) {
        this.runtimeModel = new BoardRuntimeModel();
        this.inputController = new InputController(eventBus, domain, this.runtimeModel);
        this.runtimeController = new BoardRuntimeController(eventBus, domain, this.runtimeModel);
        this.logicController = new BoardLogicController(eventBus, domain, this.runtimeModel);
        this.stateController = new GameStateController(eventBus, domain);
    }
}