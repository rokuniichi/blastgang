import { EventBus } from "../../../../core/eventbus/EventBus";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { DomainGraph } from "../../../domain/DomainGraph";
import { VisualTileDestroyed } from "../../../presentation/board/events/VisualTileDestroyed";
import { VisualTileLanded } from "../../../presentation/board/events/VisualTileLanded";
import { VisualTileShaken } from "../../../presentation/board/events/VisualTileShaken";
import { VisualTileSwapped } from "../../../presentation/board/events/VisualTileSwapped";
import { VisualTileTransformed } from "../../../presentation/board/events/VisualTileTransformed";
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
            VisualTileLanded,
            VisualTileSwapped,
            VisualTileDestroyed,
            VisualTileShaken,
            VisualTileTransformed
        ].forEach(eventType => {
            this.on(eventType, this.onTileStabilized)
        });
    }

    private onTileStabilized = (event: { id: TileId }): void => {
        this._runtimeModel.removeUnstable(event.id);
    };
}