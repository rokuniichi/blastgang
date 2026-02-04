import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { DomainGraph } from "../../../domain/DomainGraph";
import { VisualTileDestroyed } from "../../../presentation/board/events/TileViewDestroyed";
import { VisualTileStabilized } from "../../../presentation/board/events/VisualTileStabilized";
import { BaseController } from "../../common/controllers/BaseController";
import { BoardRuntimeModel } from "../models/BoardRuntimeModel";

export class BoardRuntimeController extends BaseController {

    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    private readonly _eventBus: EventBus;
    private readonly _runtimeModel: BoardRuntimeModel;

    public constructor(eventBus: EventBus, domain: DomainGraph, runtimeModel: BoardRuntimeModel) {
        super();
        this._eventBus = eventBus;
        this._runtimeModel = runtimeModel;
    }

    protected onInit(): void {
        [
            VisualTileStabilized,
            VisualTileDestroyed
        ].forEach(eventType => {
            this._subscriptions.add(
                this._eventBus.on(eventType, this.onTileUnlocked)
            );
        });
    }

    private onTileUnlocked = (event: { id: TileId }): void => {
        this._runtimeModel.removeUnstable(event.id);
    }

    public dispose(): void {
        this._subscriptions.clear();
    }
}