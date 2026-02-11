import { EventBus } from "../../../../../core/eventbus/EventBus";
import { TileId } from "../../../../domain/board/models/BoardLogicModel";
import { DomainGraph } from "../../../../domain/DomainGraph";
import { VisualTileDestroyed } from "../../../../presentation/board/events/VisualTileDestroyed";
import { VisualTileFlown } from "../../../../presentation/board/events/VisualTileFlown";
import { VisualTileLanded } from "../../../../presentation/board/events/VisualTileLanded";
import { VisualTileShaken } from "../../../../presentation/board/events/VisualTileShaken";
import { VisualTileSwapped } from "../../../../presentation/board/events/VisualTileSwapped";
import { VisualTileTransformed } from "../../../../presentation/board/events/VisualTileTransformed";
import { EventController } from "../../../common/controllers/BaseController";
import { BoardInteractivityModel } from "../models/BoardInteractivityModel";

export class BoardInteractivityController extends EventController {
    private readonly _interactivityModel: BoardInteractivityModel;

    public constructor(eventBus: EventBus, domain: DomainGraph, interactivityModel: BoardInteractivityModel) {
        super(eventBus);

        this._interactivityModel = interactivityModel;
    }

    protected onInit(): void {
        [
            VisualTileLanded,
            VisualTileSwapped,
            VisualTileDestroyed,
            VisualTileShaken,
            VisualTileTransformed,
            VisualTileFlown
        ].forEach(eventType => {
            this.on(eventType, this.onTileStabilized)
        });
    }

    private onTileStabilized = (event: { id: TileId }): void => {
        this._interactivityModel.removeUnstable(event.id);
    };
}