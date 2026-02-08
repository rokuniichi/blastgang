import { EventBus } from "../../../../core/eventbus/EventBus";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { DomainGraph } from "../../../domain/DomainGraph";
import { VisualTileDestroyed } from "../../../presentation/board/events/VisualTileDestroyed";
import { VisualTileStabilized } from "../../../presentation/board/events/VisualTileStabilized";
import { EventController } from "../../common/controllers/BaseController";
import { BoardRuntimeModel } from "../models/BoardRuntimeModel";

export class BoardRuntimeController extends EventController {
    private readonly _runtimeModel: BoardRuntimeModel;

    public constructor(eventBus: EventBus, domain: DomainGraph, runtimeModel: BoardRuntimeModel) {
        super(eventBus);

        this._runtimeModel = runtimeModel;
    }

    protected onInit(): void {
        [
            VisualTileStabilized,
            VisualTileDestroyed
        ].forEach(eventType => {
            this.on(eventType, this.onTileStabilized)
        });
    }

    private onTileStabilized = (event: { id: TileId }): void => {
        this._runtimeModel.removeUnstable(event.id);
    };
}